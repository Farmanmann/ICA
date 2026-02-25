# Generated manually

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('loans', '0005_loan_loan_type_loan_vehicle_make_loan_vehicle_model_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Verification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('verification_type', models.CharField(choices=[('identity', 'Identity Verification'), ('income', 'Income/Payroll Verification'), ('bank_account', 'Bank Account Verification'), ('sanctions', 'OFAC/Sanctions Screening'), ('fraud', 'Fraud Check')], max_length=20)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('in_progress', 'In Progress'), ('verified', 'Verified'), ('failed', 'Failed'), ('manual_review', 'Manual Review Required')], default='pending', max_length=20)),
                ('provider', models.CharField(choices=[('persona', 'Persona'), ('trulioo', 'Trulioo'), ('onfido', 'Onfido'), ('argyle', 'Argyle'), ('plaid', 'Plaid'), ('finicity', 'Finicity'), ('internal', 'Internal/Manual')], default='internal', max_length=20)),
                ('external_verification_id', models.CharField(blank=True, help_text='ID from external verification provider', max_length=255, null=True)),
                ('verification_url', models.URLField(blank=True, help_text='URL for user to complete verification', null=True)),
                ('verification_data', models.JSONField(blank=True, default=dict, help_text='Stores verification response data')),
                ('verified_at', models.DateTimeField(blank=True, null=True)),
                ('failed_reason', models.TextField(blank=True, null=True)),
                ('reviewer_notes', models.TextField(blank=True, help_text='For manual review notes', null=True)),
                ('user_consent', models.BooleanField(default=False, help_text='User consent for verification')),
                ('consent_timestamp', models.DateTimeField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('loan', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='verifications', to='loans.loan')),
                ('reviewed_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='reviewed_verifications', to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='verifications', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.AddIndex(
            model_name='verification',
            index=models.Index(fields=['user', 'verification_type'], name='loans_verif_user_id_46d8ca_idx'),
        ),
        migrations.AddIndex(
            model_name='verification',
            index=models.Index(fields=['status'], name='loans_verif_status_c8e7d8_idx'),
        ),
    ]
