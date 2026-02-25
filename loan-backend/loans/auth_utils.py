# loans/auth_utils.py

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.contrib.auth.models import User


class EmailVerificationTokenGenerator(PasswordResetTokenGenerator):
    """
    Token generator for email verification.
    Creates unique tokens that are valid for a limited time.
    """
    def _make_hash_value(self, user, timestamp):
        # Include user's email and is_active status in the hash
        email_field = user.email or ''
        is_active = user.is_active
        return f"{user.pk}{timestamp}{email_field}{is_active}"


email_verification_token = EmailVerificationTokenGenerator()


def send_verification_email(user, request=None):
    """
    Send email verification link to user's email address.

    Args:
        user: User instance
        request: HTTP request object (optional, for building absolute URLs)

    Returns:
        bool: True if email was sent successfully, False otherwise
    """
    try:
        # Generate token
        token = email_verification_token.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        # Build verification URL
        frontend_url = settings.FRONTEND_URL
        verification_url = f"{frontend_url}/auth/verify-email?uid={uid}&token={token}"

        # Email context
        context = {
            'user': user,
            'verification_url': verification_url,
            'site_name': 'Islamic Loan Portal',
        }

        # Email subject
        subject = 'Verify Your Email Address - Islamic Loan Portal'

        # Email body (plain text)
        message = f"""
Hello {user.first_name or user.username},

Thank you for signing up for Islamic Loan Portal!

Please verify your email address by clicking the link below:

{verification_url}

This link will expire in 24 hours.

If you didn't create this account, please ignore this email.

Best regards,
Islamic Loan Portal Team
"""

        # Send email
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )

        return True

    except Exception as e:
        print(f"Error sending verification email: {e}")
        return False


def send_password_reset_email(user, request=None):
    """
    Send password reset link to user's email address.

    Args:
        user: User instance
        request: HTTP request object (optional)

    Returns:
        bool: True if email was sent successfully, False otherwise
    """
    try:
        # Generate token (using Django's built-in password reset token)
        from django.contrib.auth.tokens import default_token_generator
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        # Build reset URL
        frontend_url = settings.FRONTEND_URL
        reset_url = f"{frontend_url}/auth/reset-password?uid={uid}&token={token}"

        # Email subject
        subject = 'Reset Your Password - Islamic Loan Portal'

        # Email body
        message = f"""
Hello {user.first_name or user.username},

You requested to reset your password for your Islamic Loan Portal account.

Please click the link below to set a new password:

{reset_url}

This link will expire in 24 hours.

If you didn't request a password reset, please ignore this email. Your password will not be changed.

Best regards,
Islamic Loan Portal Team
"""

        # Send email
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )

        return True

    except Exception as e:
        print(f"Error sending password reset email: {e}")
        return False


def verify_email_token(uid, token):
    """
    Verify email verification token and return user if valid.

    Args:
        uid: Base64 encoded user ID
        token: Email verification token

    Returns:
        User instance if valid, None otherwise
    """
    try:
        # Decode user ID
        user_id = force_str(urlsafe_base64_decode(uid))
        user = User.objects.get(pk=user_id)

        # Check token
        if email_verification_token.check_token(user, token):
            return user

        return None

    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return None


def verify_password_reset_token(uid, token):
    """
    Verify password reset token and return user if valid.

    Args:
        uid: Base64 encoded user ID
        token: Password reset token

    Returns:
        User instance if valid, None otherwise
    """
    try:
        from django.contrib.auth.tokens import default_token_generator

        # Decode user ID
        user_id = force_str(urlsafe_base64_decode(uid))
        user = User.objects.get(pk=user_id)

        # Check token
        if default_token_generator.check_token(user, token):
            return user

        return None

    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return None
