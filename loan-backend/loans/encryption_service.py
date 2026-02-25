"""
Local Encryption Service using AES-256-GCM
Works with data keys from KMS for envelope encryption
"""
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.backends import default_backend
import os
import base64
import logging

logger = logging.getLogger(__name__)


class EncryptionService:
    """
    Local encryption/decryption using AES-256-GCM

    This is the LOCAL part of envelope encryption:
    - Fast (no network calls)
    - Free (no API costs)
    - Secure (AES-256 with authenticated encryption)
    """

    @staticmethod
    def encrypt(plaintext_key, data):
        """
        Encrypt data locally using a plaintext data key.

        Uses AES-256-GCM for authenticated encryption:
        - Confidentiality (data is encrypted)
        - Integrity (tampering is detected)
        - Authentication (ensures data hasn't been modified)

        This is FAST - no network calls, pure local computation.

        Args:
            plaintext_key (bytes): 256-bit key from KMS.generate_data_key()
            data (str or bytes): Data to encrypt

        Returns:
            str: Base64-encoded encrypted data (nonce + ciphertext + tag)
        """
        try:
            # Convert string to bytes if needed
            if isinstance(data, str):
                data = data.encode('utf-8')

            # Create AES-GCM cipher
            aesgcm = AESGCM(plaintext_key)

            # Generate random nonce (12 bytes for GCM)
            nonce = os.urandom(12)

            # Encrypt (includes authentication tag)
            ciphertext = aesgcm.encrypt(nonce, data, None)

            # Combine nonce + ciphertext for storage
            # Format: [nonce (12 bytes)][ciphertext + tag (variable)]
            encrypted_blob = nonce + ciphertext

            # Encode to base64 for storage in database
            encoded = base64.b64encode(encrypted_blob).decode('utf-8')

            logger.debug(f"Encrypted data locally (size: {len(data)} bytes)")

            return encoded

        except Exception as e:
            logger.error(f"Local encryption error: {e}")
            raise Exception(f"Failed to encrypt data: {str(e)}")

    @staticmethod
    def decrypt(plaintext_key, encrypted_data):
        """
        Decrypt data locally using a plaintext data key.

        Companion to encrypt(). Also FAST - no network calls.

        Args:
            plaintext_key (bytes): 256-bit key (decrypted from KMS)
            encrypted_data (str): Base64-encoded encrypted data from encrypt()

        Returns:
            str: Decrypted plaintext
        """
        try:
            # Decode from base64
            encrypted_blob = base64.b64decode(encrypted_data.encode('utf-8'))

            # Extract nonce and ciphertext
            nonce = encrypted_blob[:12]
            ciphertext = encrypted_blob[12:]

            # Create AES-GCM cipher
            aesgcm = AESGCM(plaintext_key)

            # Decrypt (automatically verifies authentication tag)
            plaintext_bytes = aesgcm.decrypt(nonce, ciphertext, None)

            # Convert bytes to string
            plaintext = plaintext_bytes.decode('utf-8')

            logger.debug(f"Decrypted data locally (size: {len(plaintext)} bytes)")

            return plaintext

        except Exception as e:
            logger.error(f"Local decryption error: {e}")
            raise Exception(f"Failed to decrypt data: {str(e)}")

    @staticmethod
    def encrypt_batch(plaintext_key, data_dict):
        """
        Encrypt multiple fields with the same data key (efficient!)

        This is the power of envelope encryption:
        - 1 data key encrypts ALL fields
        - All operations are local (fast)
        - Much cheaper than calling KMS per field

        Args:
            plaintext_key (bytes): 256-bit key from KMS
            data_dict (dict): {'field_name': 'value', ...}

        Returns:
            dict: {'field_name': 'encrypted_value', ...}
        """
        encrypted = {}

        for field_name, value in data_dict.items():
            if value is not None:
                encrypted[field_name] = EncryptionService.encrypt(plaintext_key, value)
            else:
                encrypted[field_name] = None

        logger.info(f"Batch encrypted {len(data_dict)} fields locally")

        return encrypted

    @staticmethod
    def decrypt_batch(plaintext_key, encrypted_dict):
        """
        Decrypt multiple fields with the same data key (efficient!)

        Args:
            plaintext_key (bytes): 256-bit key (decrypted from KMS)
            encrypted_dict (dict): {'field_name': 'encrypted_value', ...}

        Returns:
            dict: {'field_name': 'decrypted_value', ...}
        """
        decrypted = {}

        for field_name, encrypted_value in encrypted_dict.items():
            if encrypted_value is not None:
                decrypted[field_name] = EncryptionService.decrypt(plaintext_key, encrypted_value)
            else:
                decrypted[field_name] = None

        logger.info(f"Batch decrypted {len(encrypted_dict)} fields locally")

        return decrypted


# Example usage (for reference):
"""
from .kms_client import get_kms_client
from .encryption_service import EncryptionService

# Step 1: Get data key from KMS (1 API call)
kms = get_kms_client()
data_key = kms.generate_data_key()

plaintext_key = data_key['Plaintext']
encrypted_key = data_key['CiphertextBlob']

# Step 2: Encrypt data locally (0 API calls, fast!)
encrypted_ssn = EncryptionService.encrypt(plaintext_key, "123-45-6789")
encrypted_income = EncryptionService.encrypt(plaintext_key, "85000")

# Store encrypted_key + encrypted data in database

# Later, to decrypt:
# Step 1: Decrypt data key with KMS (1 API call)
plaintext_key = kms.decrypt_data_key(encrypted_key)

# Step 2: Decrypt data locally (0 API calls, fast!)
ssn = EncryptionService.decrypt(plaintext_key, encrypted_ssn)
income = EncryptionService.decrypt(plaintext_key, encrypted_income)

# Total: 2 KMS calls for entire loan (1 encrypt, 1 decrypt)
# vs 4 KMS calls with direct encryption (2 fields × 2 operations)
"""
