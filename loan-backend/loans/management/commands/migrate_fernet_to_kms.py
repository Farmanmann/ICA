"""
Management command to migrate Fernet-encrypted data to KMS tokens.

This command reads the old Fernet-encrypted data directly from the database
and converts it to KMS tokens in the TokenVault.

Usage:
    python manage.py migrate_fernet_to_kms

Requirements:
    - FIELD_ENCRYPTION_KEY must still be in .env
    - AWS KMS must be configured and working
    - TokenService must be functional
"""

from django.core.management.base import BaseCommand
from django.db import connection
from cryptography.fernet import Fernet
import os
from loans.token_service import TokenService
from loans.models import Loan, UserProfile


class Command(BaseCommand):
    help = 'Migrate Fernet-encrypted data to KMS tokens'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Run without making changes to show what would be migrated',
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']

        self.stdout.write(self.style.WARNING(
            '\n' + '='*70
        ))
        self.stdout.write(self.style.WARNING(
            '  🔄 FERNET TO KMS MIGRATION'
        ))
        self.stdout.write(self.style.WARNING(
            '='*70 + '\n'
        ))

        # Check for Fernet key
        fernet_key = os.environ.get('FIELD_ENCRYPTION_KEY')
        if not fernet_key:
            self.stdout.write(self.style.ERROR(
                '❌ ERROR: FIELD_ENCRYPTION_KEY not found in environment.\n'
                '   Make sure your .env file still contains the old Fernet key.'
            ))
            return

        try:
            cipher = Fernet(fernet_key.encode())
            self.stdout.write(self.style.SUCCESS('✅ Fernet cipher initialized'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(
                f'❌ ERROR: Invalid FIELD_ENCRYPTION_KEY: {e}'
            ))
            return

        # Initialize TokenService
        try:
            token_service = TokenService()
            self.stdout.write(self.style.SUCCESS('✅ TokenService initialized'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(
                f'❌ ERROR: Failed to initialize TokenService: {e}\n'
                '   Make sure AWS KMS is configured correctly.'
            ))
            return

        if dry_run:
            self.stdout.write(self.style.WARNING('\n🔍 DRY RUN MODE - No changes will be made\n'))

        # Migrate loans using raw SQL to access old columns
        self.stdout.write('\n📊 Migrating Loan records...')
        self._migrate_loans(cipher, token_service, dry_run)

        # Migrate user profiles
        self.stdout.write('\n📊 Migrating UserProfile records...')
        self._migrate_user_profiles(cipher, token_service, dry_run)

        self.stdout.write(self.style.SUCCESS(
            '\n' + '='*70
        ))
        if dry_run:
            self.stdout.write(self.style.WARNING(
                '  ✅ DRY RUN COMPLETE - Run without --dry-run to apply changes'
            ))
        else:
            self.stdout.write(self.style.SUCCESS(
                '  ✅ MIGRATION COMPLETE'
            ))
        self.stdout.write(self.style.SUCCESS(
            '='*70 + '\n'
        ))

    def _decrypt_fernet_value(self, cipher, encrypted_value):
        """Decrypt a Fernet-encrypted value"""
        if not encrypted_value:
            return None
        try:
            return cipher.decrypt(encrypted_value.encode()).decode()
        except Exception as e:
            self.stdout.write(self.style.WARNING(
                f'   ⚠️  Failed to decrypt value: {e}'
            ))
            return None

    def _migrate_loans(self, cipher, token_service, dry_run):
        """Migrate loan records from Fernet to KMS"""
        with connection.cursor() as cursor:
            # Get loans with old Fernet-encrypted columns
            cursor.execute("""
                SELECT id, phone, address, annual_income, credit_score,
                       property_address, property_value, vehicle_make,
                       vehicle_model, vehicle_year, vehicle_value
                FROM loans_loan
            """)

            rows = cursor.fetchall()
            self.stdout.write(f'   Found {len(rows)} loan records')

            migrated_count = 0
            for row in rows:
                loan_id = row[0]
                old_phone = row[1]
                old_address = row[2]
                old_annual_income = row[3]
                old_credit_score = row[4]
                old_property_address = row[5]
                old_property_value = row[6]
                old_vehicle_make = row[7]
                old_vehicle_model = row[8]
                old_vehicle_year = row[9]
                old_vehicle_value = row[10]

                # Decrypt and tokenize each field
                tokens = {}

                if old_phone:
                    decrypted = self._decrypt_fernet_value(cipher, old_phone)
                    if decrypted and not dry_run:
                        tokens['phone_token'] = token_service.tokenize(decrypted, 'phone')

                if old_address:
                    decrypted = self._decrypt_fernet_value(cipher, old_address)
                    if decrypted and not dry_run:
                        tokens['address_token'] = token_service.tokenize(decrypted, 'address')

                if old_annual_income:
                    decrypted = self._decrypt_fernet_value(cipher, old_annual_income)
                    if decrypted and not dry_run:
                        tokens['annual_income_token'] = token_service.tokenize(decrypted, 'income')

                if old_credit_score:
                    decrypted = self._decrypt_fernet_value(cipher, old_credit_score)
                    if decrypted and not dry_run:
                        tokens['credit_score_token'] = token_service.tokenize(decrypted, 'credit_score')

                if old_property_address:
                    decrypted = self._decrypt_fernet_value(cipher, old_property_address)
                    if decrypted and not dry_run:
                        tokens['property_address_token'] = token_service.tokenize(decrypted, 'property_address')

                if old_property_value:
                    decrypted = self._decrypt_fernet_value(cipher, old_property_value)
                    if decrypted and not dry_run:
                        tokens['property_value_token'] = token_service.tokenize(decrypted, 'property_value')

                if old_vehicle_make:
                    decrypted = self._decrypt_fernet_value(cipher, old_vehicle_make)
                    if decrypted and not dry_run:
                        tokens['vehicle_make_token'] = token_service.tokenize(decrypted, 'vehicle_make')

                if old_vehicle_model:
                    decrypted = self._decrypt_fernet_value(cipher, old_vehicle_model)
                    if decrypted and not dry_run:
                        tokens['vehicle_model_token'] = token_service.tokenize(decrypted, 'vehicle_model')

                if old_vehicle_year:
                    decrypted = self._decrypt_fernet_value(cipher, old_vehicle_year)
                    if decrypted and not dry_run:
                        tokens['vehicle_year_token'] = token_service.tokenize(decrypted, 'vehicle_year')

                if old_vehicle_value:
                    decrypted = self._decrypt_fernet_value(cipher, old_vehicle_value)
                    if decrypted and not dry_run:
                        tokens['vehicle_value_token'] = token_service.tokenize(decrypted, 'vehicle_value')

                # Update loan with tokens
                if tokens and not dry_run:
                    Loan.objects.filter(id=loan_id).update(**tokens)
                    migrated_count += 1
                    self.stdout.write(f'   ✅ Migrated loan #{loan_id} ({len(tokens)} fields)')
                elif dry_run and (old_phone or old_address or old_annual_income):
                    self.stdout.write(f'   🔍 Would migrate loan #{loan_id}')

            if not dry_run:
                self.stdout.write(self.style.SUCCESS(
                    f'   ✅ Migrated {migrated_count} loan records'
                ))

    def _migrate_user_profiles(self, cipher, token_service, dry_run):
        """Migrate user profile records from Fernet to KMS"""
        with connection.cursor() as cursor:
            # Get user profiles with old Fernet-encrypted columns
            cursor.execute("""
                SELECT id, phone, address, national_id, annual_income, credit_score
                FROM loans_userprofile
            """)

            rows = cursor.fetchall()
            self.stdout.write(f'   Found {len(rows)} user profile records')

            migrated_count = 0
            for row in rows:
                profile_id = row[0]
                old_phone = row[1]
                old_address = row[2]
                old_national_id = row[3]
                old_annual_income = row[4]
                old_credit_score = row[5]

                # Decrypt and tokenize each field
                tokens = {}

                if old_phone:
                    decrypted = self._decrypt_fernet_value(cipher, old_phone)
                    if decrypted and not dry_run:
                        tokens['phone_token'] = token_service.tokenize(decrypted, 'phone')

                if old_address:
                    decrypted = self._decrypt_fernet_value(cipher, old_address)
                    if decrypted and not dry_run:
                        tokens['address_token'] = token_service.tokenize(decrypted, 'address')

                if old_national_id:
                    decrypted = self._decrypt_fernet_value(cipher, old_national_id)
                    if decrypted and not dry_run:
                        tokens['national_id_token'] = token_service.tokenize(decrypted, 'national_id')

                if old_annual_income:
                    decrypted = self._decrypt_fernet_value(cipher, old_annual_income)
                    if decrypted and not dry_run:
                        tokens['annual_income_token'] = token_service.tokenize(decrypted, 'income')

                if old_credit_score:
                    decrypted = self._decrypt_fernet_value(cipher, old_credit_score)
                    if decrypted and not dry_run:
                        tokens['credit_score_token'] = token_service.tokenize(decrypted, 'credit_score')

                # Update user profile with tokens
                if tokens and not dry_run:
                    UserProfile.objects.filter(id=profile_id).update(**tokens)
                    migrated_count += 1
                    self.stdout.write(f'   ✅ Migrated profile #{profile_id} ({len(tokens)} fields)')
                elif dry_run and (old_phone or old_address or old_national_id):
                    self.stdout.write(f'   🔍 Would migrate profile #{profile_id}')

            if not dry_run:
                self.stdout.write(self.style.SUCCESS(
                    f'   ✅ Migrated {migrated_count} user profile records'
                ))
