"""
AWS KMS Client for Envelope Encryption
Generates data keys for local encryption (cost-effective & fast)
"""
import boto3
from botocore.exceptions import ClientError
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


class KMSClient:
    """
    AWS KMS client wrapper for envelope encryption
    """

    def __init__(self):
        """Initialize KMS client with AWS credentials from settings"""
        self.client = boto3.client(
            'kms',
            region_name=settings.AWS_REGION,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        )
        self.key_id = settings.AWS_KMS_KEY_ID

    def generate_data_key(self):
        """
        Generate a data encryption key (DEK) using envelope encryption.

        This is the core of envelope encryption:
        - Returns a plaintext key (for you to encrypt data locally)
        - Returns the same key encrypted with your KMS master key
        - You store the encrypted key, discard the plaintext after use

        Cost: 1 KMS API call per data key

        Returns:
            dict: {
                'Plaintext': bytes,  # Use this to encrypt data locally
                'CiphertextBlob': bytes  # Store this with your encrypted data
            }
        """
        try:
            response = self.client.generate_data_key(
                KeyId=self.key_id,
                KeySpec='AES_256'  # 256-bit AES key
            )

            logger.info("Generated new data encryption key from KMS")

            return {
                'Plaintext': response['Plaintext'],
                'CiphertextBlob': response['CiphertextBlob']
            }

        except ClientError as e:
            logger.error(f"KMS generate_data_key error: {e}")
            raise Exception(f"Failed to generate data key: {str(e)}")

    def decrypt_data_key(self, encrypted_key):
        """
        Decrypt an encrypted data key using KMS.

        When you need to decrypt your data:
        1. Retrieve the encrypted data key from storage
        2. Call this method to decrypt it
        3. Use the plaintext key to decrypt your data locally

        Cost: 1 KMS API call per data key decryption

        Args:
            encrypted_key (bytes): The CiphertextBlob from generate_data_key()

        Returns:
            bytes: Plaintext data key
        """
        try:
            response = self.client.decrypt(
                CiphertextBlob=encrypted_key
            )

            logger.info("Decrypted data encryption key using KMS")

            return response['Plaintext']

        except ClientError as e:
            logger.error(f"KMS decrypt error: {e}")
            raise Exception(f"Failed to decrypt data key: {str(e)}")

    def encrypt_direct(self, plaintext):
        """
        Direct KMS encryption (NOT RECOMMENDED for regular use)

        This method is here for comparison/special cases only.
        For regular data encryption, use generate_data_key() + local encryption.

        Direct KMS encryption is:
        - Slower (network call per field)
        - More expensive (1 API call per field)
        - Has size limits (4KB max)

        Cost: 1 KMS API call per field

        Args:
            plaintext (str or bytes): Data to encrypt

        Returns:
            bytes: Encrypted ciphertext
        """
        try:
            if isinstance(plaintext, str):
                plaintext = plaintext.encode('utf-8')

            response = self.client.encrypt(
                KeyId=self.key_id,
                Plaintext=plaintext
            )

            logger.warning("Used direct KMS encryption (consider envelope encryption instead)")

            return response['CiphertextBlob']

        except ClientError as e:
            logger.error(f"KMS encrypt error: {e}")
            raise Exception(f"Failed to encrypt: {str(e)}")

    def decrypt_direct(self, ciphertext):
        """
        Direct KMS decryption (NOT RECOMMENDED for regular use)

        Companion to encrypt_direct(). Use envelope encryption instead.

        Cost: 1 KMS API call per field

        Args:
            ciphertext (bytes): Encrypted data from encrypt_direct()

        Returns:
            str: Decrypted plaintext
        """
        try:
            response = self.client.decrypt(
                CiphertextBlob=ciphertext
            )

            logger.warning("Used direct KMS decryption (consider envelope encryption instead)")

            return response['Plaintext'].decode('utf-8')

        except ClientError as e:
            logger.error(f"KMS decrypt error: {e}")
            raise Exception(f"Failed to decrypt: {str(e)}")


# Singleton instance
_kms_client = None

def get_kms_client():
    """
    Get singleton KMS client instance

    Returns:
        KMSClient: Configured KMS client
    """
    global _kms_client
    if _kms_client is None:
        _kms_client = KMSClient()
    return _kms_client
