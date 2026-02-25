"""
Token Service - Complete Tokenization with AWS KMS Envelope Encryption

This service combines:
1. AWS KMS (for master key management)
2. Envelope encryption (for cost/performance)
3. Tokenization (for clean data references)
4. Audit logging (for compliance)
"""
import secrets
import base64
from django.utils import timezone
from django.db import transaction
from .models import TokenVault, TokenAccessLog
from .kms_client import get_kms_client
from .encryption_service import EncryptionService
import logging

logger = logging.getLogger(__name__)


class TokenService:
    """
    Main tokenization service

    Provides:
    - tokenize() - Encrypt and store sensitive data, return token
    - detokenize() - Retrieve and decrypt data from token
    - batch operations - Efficient handling of multiple tokens
    - audit logging - Full compliance trail
    """

    def __init__(self):
        self.kms = get_kms_client()

    @staticmethod
    def generate_token():
        """
        Generate a cryptographically secure random token

        Returns:
            str: Token in format "tok_{random}"
        """
        random_part = secrets.token_urlsafe(16)
        return f"tok_{random_part}"

    def tokenize(self, value, field_type, created_by=None, request=None):
        """
        Tokenize sensitive data using envelope encryption

        Process:
        1. Generate data key from KMS (1 API call)
        2. Encrypt value locally with data key (fast, free)
        3. Generate random token
        4. Store encrypted value + encrypted key in TokenVault
        5. Return clean token

        Cost: 1 KMS API call per tokenize operation

        Args:
            value (str): Sensitive data to tokenize
            field_type (str): Type of data ('ssn', 'income', 'bank_account', etc.)
            created_by (User, optional): User creating the token
            request (HttpRequest, optional): For audit logging (IP, user agent)

        Returns:
            str: Token (e.g., "tok_abc123xyz...")

        Example:
            token = service.tokenize("123-45-6789", "ssn", user)
            # Returns: "tok_Gx7mK2nP9sR4vW8z"
            # Store this token in your database
        """
        try:
            # Step 1: Generate data encryption key from KMS
            # This is the ONLY KMS call in the tokenize process
            data_key = self.kms.generate_data_key()

            plaintext_key = data_key['Plaintext']
            encrypted_key = data_key['CiphertextBlob']

            # Step 2: Encrypt value locally (no network call)
            encrypted_value = EncryptionService.encrypt(plaintext_key, value)

            # Step 3: Generate token
            token = self.generate_token()

            # Step 4: Store in vault
            with transaction.atomic():
                TokenVault.objects.create(
                    token=token,
                    encrypted_value=encrypted_value,
                    encrypted_data_key=base64.b64encode(encrypted_key).decode('utf-8'),
                    field_type=field_type,
                    created_by=created_by
                )

                # Log token creation (compliance)
                self._log_access(
                    token=token,
                    field_type=field_type,
                    access_type='create',
                    accessed_by=created_by,
                    request=request,
                    success=True
                )

            logger.info(f"Tokenized {field_type} data (token: {token})")

            return token

        except Exception as e:
            logger.error(f"Tokenization error: {e}")

            # Log failed attempt
            if request:
                self._log_access(
                    token='',
                    field_type=field_type,
                    access_type='create',
                    accessed_by=created_by,
                    request=request,
                    success=False,
                    error_message=str(e)
                )

            raise Exception(f"Failed to tokenize data: {str(e)}")

    def detokenize(self, token, accessed_by=None, request=None):
        """
        Retrieve and decrypt data from a token

        Process:
        1. Look up token in TokenVault
        2. Check if token is revoked
        3. Decrypt data key with KMS (1 API call)
        4. Decrypt value locally with data key (fast, free)
        5. Log access for audit
        6. Return plaintext value

        Cost: 1 KMS API call per detokenize operation

        Args:
            token (str): Token to detokenize
            accessed_by (User, optional): User accessing the data
            request (HttpRequest, optional): For audit logging

        Returns:
            str: Decrypted plaintext value

        Raises:
            Exception: If token doesn't exist or is revoked

        Example:
            ssn = service.detokenize("tok_Gx7mK2nP9sR4vW8z", user)
            # Returns: "123-45-6789"
        """
        try:
            # Step 1: Look up token
            vault_entry = TokenVault.objects.get(token=token)

            # Step 2: Check if revoked
            if vault_entry.is_revoked:
                logger.warning(f"Attempted access to revoked token: {token}")
                raise Exception("Token has been revoked")

            # Step 3: Decrypt data key with KMS
            # This is the ONLY KMS call in the detokenize process
            encrypted_key = base64.b64decode(vault_entry.encrypted_data_key.encode('utf-8'))
            plaintext_key = self.kms.decrypt_data_key(encrypted_key)

            # Step 4: Decrypt value locally (no network call)
            plaintext_value = EncryptionService.decrypt(
                plaintext_key,
                vault_entry.encrypted_value
            )

            # Step 5: Update access tracking
            vault_entry.last_accessed_at = timezone.now()
            vault_entry.access_count += 1
            vault_entry.save(update_fields=['last_accessed_at', 'access_count'])

            # Step 6: Log access (compliance)
            self._log_access(
                token=token,
                field_type=vault_entry.field_type,
                access_type='read',
                accessed_by=accessed_by,
                request=request,
                success=True
            )

            logger.info(f"Detokenized {vault_entry.field_type} data (token: {token})")

            return plaintext_value

        except TokenVault.DoesNotExist:
            logger.error(f"Token not found: {token}")

            self._log_access(
                token=token,
                field_type='',
                access_type='read',
                accessed_by=accessed_by,
                request=request,
                success=False,
                error_message="Token not found"
            )

            raise Exception("Token not found")

        except Exception as e:
            logger.error(f"Detokenization error: {e}")

            self._log_access(
                token=token,
                field_type='',
                access_type='read',
                accessed_by=accessed_by,
                request=request,
                success=False,
                error_message=str(e)
            )

            raise Exception(f"Failed to detokenize: {str(e)}")

    def batch_detokenize(self, tokens, accessed_by=None, request=None):
        """
        Efficiently detokenize multiple tokens

        Optimization: Groups tokens by data key to minimize KMS calls

        If 100 tokens all use the same data key:
        - Naive approach: 100 KMS calls
        - Optimized approach: 1 KMS call

        Cost: Approximately 1 KMS call per unique data key

        Args:
            tokens (list): List of tokens to detokenize
            accessed_by (User, optional): User accessing the data
            request (HttpRequest, optional): For audit logging

        Returns:
            dict: {token: decrypted_value, ...}

        Example:
            tokens = ["tok_abc123", "tok_xyz789"]
            values = service.batch_detokenize(tokens, user)
            # Returns: {
            #   "tok_abc123": "123-45-6789",
            #   "tok_xyz789": "85000"
            # }
        """
        if not tokens:
            return {}

        try:
            # Fetch all vault entries
            vault_entries = TokenVault.objects.filter(
                token__in=tokens,
                is_revoked=False
            )

            # Group by encrypted data key (for efficiency)
            grouped_by_key = {}
            for entry in vault_entries:
                if entry.encrypted_data_key not in grouped_by_key:
                    grouped_by_key[entry.encrypted_data_key] = []
                grouped_by_key[entry.encrypted_data_key].append(entry)

            # Decrypt each unique data key (optimized!)
            decrypted_keys = {}
            for encrypted_key_b64 in grouped_by_key.keys():
                encrypted_key = base64.b64decode(encrypted_key_b64.encode('utf-8'))
                plaintext_key = self.kms.decrypt_data_key(encrypted_key)
                decrypted_keys[encrypted_key_b64] = plaintext_key

            # Decrypt all values locally
            result = {}
            for entry in vault_entries:
                plaintext_key = decrypted_keys[entry.encrypted_data_key]
                plaintext_value = EncryptionService.decrypt(
                    plaintext_key,
                    entry.encrypted_value
                )
                result[entry.token] = plaintext_value

                # Update access tracking
                entry.last_accessed_at = timezone.now()
                entry.access_count += 1
                entry.save(update_fields=['last_accessed_at', 'access_count'])

                # Log access
                self._log_access(
                    token=entry.token,
                    field_type=entry.field_type,
                    access_type='read',
                    accessed_by=accessed_by,
                    request=request,
                    success=True
                )

            logger.info(f"Batch detokenized {len(result)} tokens with {len(decrypted_keys)} KMS calls")

            return result

        except Exception as e:
            logger.error(f"Batch detokenization error: {e}")
            raise Exception(f"Failed to batch detokenize: {str(e)}")

    def revoke_token(self, token, revoked_by, reason="", request=None):
        """
        Revoke a token for security purposes

        Revoked tokens cannot be detokenized anymore.
        Use cases:
        - User requests data deletion
        - Security incident
        - Suspected token leak

        Args:
            token (str): Token to revoke
            revoked_by (User): User revoking the token
            reason (str): Reason for revocation
            request (HttpRequest, optional): For audit logging
        """
        try:
            vault_entry = TokenVault.objects.get(token=token)
            vault_entry.revoke(revoked_by, reason)

            self._log_access(
                token=token,
                field_type=vault_entry.field_type,
                access_type='revoke',
                accessed_by=revoked_by,
                request=request,
                success=True
            )

            logger.info(f"Revoked token {token}: {reason}")

        except TokenVault.DoesNotExist:
            logger.error(f"Attempted to revoke non-existent token: {token}")
            raise Exception("Token not found")

    def _log_access(self, token, field_type, access_type, accessed_by=None,
                    request=None, success=True, error_message=""):
        """
        Internal method to log token access for compliance

        Args:
            token (str): Token accessed
            field_type (str): Type of data
            access_type (str): 'create', 'read', 'revoke', 'failed'
            accessed_by (User, optional): User who accessed
            request (HttpRequest, optional): For IP and user agent
            success (bool): Whether access succeeded
            error_message (str): Error message if failed
        """
        ip_address = None
        user_agent = ""

        if request and hasattr(request, 'META'):
            ip_address = request.META.get('REMOTE_ADDR')
            user_agent = request.META.get('HTTP_USER_AGENT', '')[:255]

        TokenAccessLog.objects.create(
            token=token,
            field_type=field_type,
            accessed_by=accessed_by,
            access_type=access_type,
            ip_address=ip_address,
            user_agent=user_agent,
            success=success,
            error_message=error_message
        )


# Singleton instance
_token_service = None

def get_token_service():
    """
    Get singleton token service instance

    Returns:
        TokenService: Configured token service
    """
    global _token_service
    if _token_service is None:
        _token_service = TokenService()
    return _token_service
