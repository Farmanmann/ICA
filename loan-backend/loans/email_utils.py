"""
Email utility functions for sending user notifications and retention emails
"""
from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.contrib.auth.models import User
from .models import Loan, SupportTicket, AuditLog


def send_email_notification(
    subject,
    message,
    recipient_list,
    html_message=None,
    from_email=None
):
    """
    Send an email notification

    Args:
        subject: Email subject
        message: Plain text message
        recipient_list: List of recipient email addresses
        html_message: Optional HTML version of the message
        from_email: Sender email (defaults to FROM_EMAIL from settings)
    """
    if from_email is None:
        from_email = settings.FROM_EMAIL

    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=from_email,
            recipient_list=recipient_list,
            html_message=html_message,
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False


def send_welcome_email(user):
    """Send welcome email to new users"""
    subject = "Welcome to Islamic Loan Portal!"
    message = f"""
    Assalamu Alaikum {user.first_name or user.username},

    Welcome to Islamic Loan Portal! We're excited to have you join our community.

    Our platform provides Sharia-compliant financing solutions to help you achieve your goals while staying true to Islamic principles.

    Getting Started:
    1. Complete your profile
    2. Browse our financing options (Murabaha, Ijarah, Musharakah)
    3. Apply for financing that suits your needs
    4. Complete verification process
    5. Get approved and funded

    If you have any questions, our support team is here to help at {settings.SUPPORT_EMAIL}

    Best regards,
    The Islamic Loan Portal Team
    """

    html_message = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">Welcome to Islamic Loan Portal!</h2>
            <p>Assalamu Alaikum {user.first_name or user.username},</p>
            <p>We're excited to have you join our community of faithful individuals seeking Sharia-compliant financing solutions.</p>

            <h3 style="color: #2563eb;">Getting Started:</h3>
            <ol>
                <li>Complete your profile</li>
                <li>Browse our financing options (Murabaha, Ijarah, Musharakah)</li>
                <li>Apply for financing that suits your needs</li>
                <li>Complete verification process</li>
                <li>Get approved and funded</li>
            </ol>

            <p>If you have any questions, our support team is here to help at
               <a href="mailto:{settings.SUPPORT_EMAIL}">{settings.SUPPORT_EMAIL}</a>
            </p>

            <p style="margin-top: 30px;">Best regards,<br>The Islamic Loan Portal Team</p>
        </div>
    </body>
    </html>
    """

    return send_email_notification(subject, message, [user.email], html_message)


def send_loan_application_confirmation(loan):
    """Send confirmation email when loan application is submitted"""
    user = loan.borrower
    if not user or not user.email:
        return False

    subject = f"Loan Application Received - #{loan.id}"
    message = f"""
    Assalamu Alaikum {loan.borrower_name},

    We've received your loan application for {loan.get_loan_type_display()}.

    Application Details:
    - Loan ID: #{loan.id}
    - Type: {loan.get_loan_type_display()}
    - Amount: ${loan.amount:,.2f}
    - Term: {loan.term} months
    - Status: {loan.status}

    Next Steps:
    1. We'll review your application within 2-3 business days
    2. You may be asked to provide additional documentation
    3. Complete any required verification steps
    4. Receive approval decision

    You can track your application status at: {settings.FRONTEND_URL}/borrower/dashboard

    Best regards,
    The Islamic Loan Portal Team
    """

    html_message = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">Loan Application Received</h2>
            <p>Assalamu Alaikum {loan.borrower_name},</p>
            <p>We've received your loan application for <strong>{loan.get_loan_type_display()}</strong>.</p>

            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #2563eb;">Application Details</h3>
                <ul style="list-style: none; padding: 0;">
                    <li><strong>Loan ID:</strong> #{loan.id}</li>
                    <li><strong>Type:</strong> {loan.get_loan_type_display()}</li>
                    <li><strong>Amount:</strong> ${loan.amount:,.2f}</li>
                    <li><strong>Term:</strong> {loan.term} months</li>
                    <li><strong>Status:</strong> {loan.status}</li>
                </ul>
            </div>

            <h3 style="color: #2563eb;">Next Steps:</h3>
            <ol>
                <li>We'll review your application within 2-3 business days</li>
                <li>You may be asked to provide additional documentation</li>
                <li>Complete any required verification steps</li>
                <li>Receive approval decision</li>
            </ol>

            <p style="text-align: center; margin: 30px 0;">
                <a href="{settings.FRONTEND_URL}/borrower/dashboard"
                   style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                    Track Application Status
                </a>
            </p>

            <p style="margin-top: 30px;">Best regards,<br>The Islamic Loan Portal Team</p>
        </div>
    </body>
    </html>
    """

    return send_email_notification(subject, message, [user.email], html_message)


def send_loan_status_update(loan):
    """Send email when loan status changes (approved/rejected)"""
    user = loan.borrower
    if not user or not user.email:
        return False

    subject = f"Loan Application {loan.status} - #{loan.id}"

    if loan.status == 'Approved':
        message = f"""
        Congratulations {loan.borrower_name}!

        Your loan application #{loan.id} has been APPROVED!

        Loan Details:
        - Amount: ${loan.amount:,.2f}
        - Term: {loan.term} months
        - Monthly Payment: ${loan.monthly_payment:,.2f}

        Next Steps:
        1. Review and sign the loan agreement
        2. Complete final verification (if needed)
        3. Funds will be disbursed within 3-5 business days

        View details: {settings.FRONTEND_URL}/borrower/dashboard

        Best regards,
        The Islamic Loan Portal Team
        """

        color = "#10b981"  # Green
    elif loan.status == 'Rejected':
        message = f"""
        Dear {loan.borrower_name},

        We regret to inform you that your loan application #{loan.id} has not been approved at this time.

        We understand this may be disappointing. Please contact our support team at {settings.SUPPORT_EMAIL} to discuss alternative options or reapply in the future.

        Best regards,
        The Islamic Loan Portal Team
        """
        color = "#ef4444"  # Red
    else:
        return False  # Don't send for other statuses

    html_message = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: {color}; color: white; padding: 20px; border-radius: 8px; text-align: center;">
                <h2 style="margin: 0;">Application {loan.status}</h2>
            </div>
            <div style="padding: 20px;">
                {message}
            </div>
        </div>
    </body>
    </html>
    """

    return send_email_notification(subject, message, [user.email], html_message)


def send_payment_reminder(loan, days_until_due=7):
    """Send payment reminder email"""
    user = loan.borrower
    if not user or not user.email:
        return False

    subject = f"Payment Reminder - Loan #{loan.id}"
    message = f"""
    Assalamu Alaikum {loan.borrower_name},

    This is a friendly reminder that your payment for Loan #{loan.id} is due in {days_until_due} days.

    Payment Details:
    - Due Date: {loan.due_date}
    - Amount Due: ${loan.monthly_payment:,.2f}
    - Remaining Balance: ${loan.remaining_balance:,.2f}

    Make Payment: {settings.FRONTEND_URL}/borrower/dashboard

    If you've already made this payment, please disregard this message.

    JazakAllah Khair,
    The Islamic Loan Portal Team
    """

    return send_email_notification(subject, message, [user.email])


def send_support_ticket_confirmation(ticket):
    """Send confirmation when support ticket is created"""
    subject = f"Support Ticket Created - {ticket.ticket_number}"
    message = f"""
    Assalamu Alaikum {ticket.user.username},

    Your support ticket has been created successfully.

    Ticket Details:
    - Ticket Number: {ticket.ticket_number}
    - Subject: {ticket.subject}
    - Category: {ticket.get_category_display()}
    - Status: {ticket.status}

    We aim to respond within 24 hours. You'll receive an email notification when we reply.

    View ticket: {settings.FRONTEND_URL}/support/tickets/{ticket.id}

    Best regards,
    Support Team
    """

    return send_email_notification(subject, message, [ticket.user.email])


def send_retention_email(user, email_type='inactive'):
    """
    Send retention emails to keep users engaged

    email_type can be:
    - 'inactive': User hasn't logged in for a while
    - 'incomplete_application': User started but didn't complete loan application
    - 'feature_update': New features announcement
    """

    if email_type == 'inactive':
        subject = "We Miss You at Islamic Loan Portal!"
        message = f"""
        Assalamu Alaikum {user.first_name or user.username},

        We noticed you haven't visited us in a while. We'd love to have you back!

        Here's what you might have missed:
        - New financing options available
        - Improved application process
        - Better rates on select products

        Visit now: {settings.FRONTEND_URL}

        If you have any questions or concerns, please reach out to {settings.SUPPORT_EMAIL}

        Best regards,
        The Islamic Loan Portal Team
        """

    elif email_type == 'incomplete_application':
        subject = "Complete Your Loan Application"
        message = f"""
        Assalamu Alaikum {user.first_name or user.username},

        You started a loan application but didn't complete it. We're here to help!

        Complete your application to:
        - Get approved faster
        - Access competitive rates
        - Achieve your financial goals

        Continue application: {settings.FRONTEND_URL}/borrower/apply

        Need help? Contact us at {settings.SUPPORT_EMAIL}

        Best regards,
        The Islamic Loan Portal Team
        """

    else:  # feature_update
        subject = "New Features at Islamic Loan Portal!"
        message = f"""
        Assalamu Alaikum {user.first_name or user.username},

        We've added new features to make your experience better:

        - Faster verification process
        - Real-time application tracking
        - Mobile-friendly interface
        - 24/7 support chat

        Check them out: {settings.FRONTEND_URL}

        Best regards,
        The Islamic Loan Portal Team
        """

    return send_email_notification(subject, message, [user.email])
