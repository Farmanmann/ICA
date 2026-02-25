"""
Django signals for automatic email notifications and audit logging.

This module handles:
- Email notifications for loan lifecycle events
- Audit logging for security-critical actions
- Automatic triggers on model changes
"""

from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from django.contrib.auth.signals import user_logged_in, user_logged_out, user_login_failed

from .models import Loan, Repayment, SupportTicket, Verification, AuditLog
from .email_utils import (
    send_welcome_email,
    send_loan_application_confirmation,
    send_loan_status_update,
    send_support_ticket_confirmation
)


# ============= USER SIGNALS =============

@receiver(post_save, sender=User)
def send_welcome_email_on_registration(sender, instance, created, **kwargs):
    """Send welcome email when new user is created"""
    if created:
        try:
            send_welcome_email(instance)
            print(f"✉️ Welcome email sent to {instance.email}")
        except Exception as e:
            print(f"❌ Failed to send welcome email: {e}")


@receiver(user_logged_in)
def log_user_login(sender, request, user, **kwargs):
    """Log user login events"""
    try:
        ip_address = request.META.get('REMOTE_ADDR') if hasattr(request, 'META') else None
        user_agent = request.META.get('HTTP_USER_AGENT', '')[:255] if hasattr(request, 'META') else ''

        AuditLog.objects.create(
            user=user,
            action='login',
            severity='info',
            description=f'User {user.username} logged in',
            ip_address=ip_address,
            user_agent=user_agent
        )
        print(f"📝 Login logged for {user.username}")
    except Exception as e:
        print(f"❌ Failed to log login: {e}")


@receiver(user_logged_out)
def log_user_logout(sender, request, user, **kwargs):
    """Log user logout events"""
    try:
        ip_address = request.META.get('REMOTE_ADDR') if hasattr(request, 'META') else None
        user_agent = request.META.get('HTTP_USER_AGENT', '')[:255] if hasattr(request, 'META') else ''

        AuditLog.objects.create(
            user=user,
            action='logout',
            severity='info',
            description=f'User {user.username} logged out',
            ip_address=ip_address,
            user_agent=user_agent
        )
        print(f"📝 Logout logged for {user.username}")
    except Exception as e:
        print(f"❌ Failed to log logout: {e}")


@receiver(user_login_failed)
def log_failed_login(sender, credentials, request, **kwargs):
    """Log failed login attempts"""
    try:
        ip_address = request.META.get('REMOTE_ADDR') if hasattr(request, 'META') else None
        user_agent = request.META.get('HTTP_USER_AGENT', '')[:255] if hasattr(request, 'META') else ''
        username = credentials.get('username', 'unknown')

        AuditLog.objects.create(
            action='login_failed',
            severity='warning',
            description=f'Failed login attempt for username: {username}',
            ip_address=ip_address,
            user_agent=user_agent
        )
        print(f"⚠️ Failed login attempt for {username}")
    except Exception as e:
        print(f"❌ Failed to log failed login: {e}")


# ============= LOAN SIGNALS =============

@receiver(post_save, sender=Loan)
def handle_loan_creation_and_updates(sender, instance, created, **kwargs):
    """
    Handle loan lifecycle events:
    - Send confirmation email when loan is created
    - Send status update email when loan is approved/rejected
    - Log audit events
    """
    try:
        if created:
            # New loan created
            send_loan_application_confirmation(instance)
            print(f"✉️ Loan application confirmation sent for Loan #{instance.id}")

            # Log audit event
            AuditLog.objects.create(
                user=instance.borrower,
                action='loan_created',
                severity='info',
                description=f'Loan application submitted: {instance.borrower_name} - ${instance.amount}',
                loan=instance,
                metadata={
                    'loan_id': instance.id,
                    'amount': str(instance.amount),
                    'term': instance.term,
                    'loan_type': instance.loan_type
                }
            )
            print(f"📝 Loan creation logged for Loan #{instance.id}")
        else:
            # Loan updated - check if status changed
            # Note: We can't access old values in post_save without caching
            # So we'll just send email for approved/rejected status
            if instance.status in ['Approved', 'Rejected']:
                send_loan_status_update(instance)
                print(f"✉️ Loan status update sent for Loan #{instance.id} - {instance.status}")

                # Log audit event
                action = 'loan_approved' if instance.status == 'Approved' else 'loan_rejected'
                AuditLog.objects.create(
                    user=instance.borrower,
                    action=action,
                    severity='info',
                    description=f'Loan {instance.status.lower()}: {instance.borrower_name} - ${instance.amount}',
                    loan=instance,
                    metadata={
                        'loan_id': instance.id,
                        'status': instance.status
                    }
                )
                print(f"📝 Loan {instance.status.lower()} logged for Loan #{instance.id}")
    except Exception as e:
        print(f"❌ Error in loan signal handler: {e}")


# ============= REPAYMENT SIGNALS =============

@receiver(post_save, sender=Repayment)
def log_payment_creation(sender, instance, created, **kwargs):
    """Log payment creation for audit trail"""
    if created:
        try:
            AuditLog.objects.create(
                user=instance.loan.borrower,
                action='payment_made',
                severity='info',
                description=f'Payment made: ${instance.amount} for Loan #{instance.loan.id}',
                loan=instance.loan,
                metadata={
                    'payment_id': instance.id,
                    'amount': str(instance.amount),
                    'payment_method': instance.payment_method,
                    'status': instance.status
                }
            )
            print(f"📝 Payment logged: ${instance.amount} for Loan #{instance.loan.id}")
        except Exception as e:
            print(f"❌ Failed to log payment: {e}")


# ============= SUPPORT TICKET SIGNALS =============

@receiver(post_save, sender=SupportTicket)
def handle_support_ticket_creation(sender, instance, created, **kwargs):
    """
    Send confirmation email when support ticket is created
    Log ticket creation for audit
    """
    if created:
        try:
            # Send confirmation email
            send_support_ticket_confirmation(instance)
            print(f"✉️ Support ticket confirmation sent for Ticket #{instance.ticket_number}")

            # Log audit event
            AuditLog.objects.create(
                user=instance.user,
                action='support_ticket_created',
                severity='info',
                description=f'Support ticket created: {instance.ticket_number} - {instance.subject}',
                support_ticket=instance,
                metadata={
                    'ticket_number': instance.ticket_number,
                    'category': instance.category,
                    'priority': instance.priority
                }
            )
            print(f"📝 Support ticket logged: {instance.ticket_number}")
        except Exception as e:
            print(f"❌ Error in support ticket signal handler: {e}")


# ============= VERIFICATION SIGNALS =============

@receiver(post_save, sender=Verification)
def log_verification_events(sender, instance, created, **kwargs):
    """Log verification creation and completion"""
    try:
        if created:
            AuditLog.objects.create(
                user=instance.user,
                action='verification_initiated',
                severity='info',
                description=f'Verification initiated: {instance.get_verification_type_display()}',
                loan=instance.loan,
                metadata={
                    'verification_id': instance.id,
                    'verification_type': instance.verification_type,
                    'provider': instance.provider
                }
            )
            print(f"📝 Verification initiated logged for User {instance.user.username}")
        elif instance.status == 'verified':
            AuditLog.objects.create(
                user=instance.user,
                action='verification_completed',
                severity='info',
                description=f'Verification completed: {instance.get_verification_type_display()}',
                loan=instance.loan,
                metadata={
                    'verification_id': instance.id,
                    'verification_type': instance.verification_type,
                    'status': instance.status
                }
            )
            print(f"📝 Verification completed logged for User {instance.user.username}")
    except Exception as e:
        print(f"❌ Error in verification signal handler: {e}")
