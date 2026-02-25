from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('borrower', 'Borrower'),
        ('lender', 'Lender'),
        ('admin', 'Admin'),
    ]

    LENDER_TYPE_CHOICES = [
        ('individual', 'Individual Lender'),
        ('organization', 'Organization'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='borrower')

    # Lender-specific fields
    lender_type = models.CharField(max_length=20, choices=LENDER_TYPE_CHOICES, blank=True, null=True, help_text="Type of lender (individual/organization)")
    organization = models.CharField(max_length=255, blank=True, null=True, help_text="Organization name for organizational lenders")

    # Email verification
    email_verified = models.BooleanField(default=False, help_text="Email verification status")
    email_verified_at = models.DateTimeField(null=True, blank=True, help_text="When email was verified")

    # Tokenized fields (using AWS KMS envelope encryption)
    phone_token = models.CharField(max_length=50, blank=True, null=True, help_text="Token for encrypted phone")
    address_token = models.CharField(max_length=50, blank=True, null=True, help_text="Token for encrypted address")
    national_id_token = models.CharField(max_length=50, blank=True, null=True, help_text="Token for encrypted national ID")

    date_of_birth = models.DateField(null=True, blank=True)

    # Financial info - Tokenized
    employment_status = models.CharField(max_length=50, blank=True)
    annual_income_token = models.CharField(max_length=50, blank=True, null=True, help_text="Token for encrypted income")
    credit_score_token = models.CharField(max_length=50, blank=True, null=True, help_text="Token for encrypted credit score")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.role}"


class LoanDocument(models.Model):
    DOCUMENT_TYPES = [
        ('id', 'National ID / Passport'),
        ('proof_income', 'Proof of Income'),
        ('bank_statement', 'Bank Statement'),
        ('property_docs', 'Property Documents'),
        ('other', 'Other'),
    ]
    
    loan = models.ForeignKey('Loan', on_delete=models.CASCADE, related_name='documents')
    document_type = models.CharField(max_length=20, choices=DOCUMENT_TYPES)
    file = models.FileField(upload_to='loan_documents/%Y/%m/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f"Loan #{self.loan.id} - {self.get_document_type_display()}"


class Loan(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]

    LOAN_TYPE_CHOICES = [
        ('murabaha', 'Murabaha - Cost-Plus Financing'),
        ('ijarah', 'Ijarah - Leasing'),
        ('musharakah', 'Musharakah - Partnership'),
    ]

    PURPOSE_CHOICES = [
        ('property', 'Property Purchase'),
        ('car', 'Car Purchase'),
        ('renovation', 'Renovation'),
        ('business', 'Business'),
        ('other', 'Other'),
    ]

    EMPLOYMENT_CHOICES = [
        ('employed', 'Employed'),
        ('self-employed', 'Self-Employed'),
        ('retired', 'Retired'),
        ('other', 'Other'),
    ]
    
    def calculate_stats(self):
        """Return loan statistics"""
        total_paid = float(self.total_paid)
        amount = float(self.amount)
        progress = (total_paid / amount * 100) if amount > 0 else 0
        
        return {
            'monthly_payment': self.monthly_payment,
            'total_paid': total_paid,
            'remaining_balance': self.remaining_balance,
            'payment_progress': round(progress, 2),
            'payments_count': self.payments.filter(status='completed').count(),
            'next_payment_due': self.due_date,
        }
    
    # Personal Information
    borrower = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='loans')
    borrower_name = models.CharField(max_length=255, default='Unknown Borrower')
    email = models.EmailField(default='unknown@example.com')

    # Tokenized sensitive fields (using AWS KMS envelope encryption)
    phone_token = models.CharField(max_length=50, blank=True, null=True, help_text="Token for encrypted phone")
    address_token = models.CharField(max_length=50, blank=True, null=True, help_text="Token for encrypted address")
    ssn_token = models.CharField(max_length=50, blank=True, null=True, help_text="Token for encrypted SSN")

    # Loan Details
    loan_type = models.CharField(max_length=20, choices=LOAN_TYPE_CHOICES, default='murabaha', help_text="Islamic financing type")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    term = models.IntegerField(help_text="Loan term in months")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    purpose = models.CharField(max_length=20, choices=PURPOSE_CHOICES, blank=True, null=True)

    # Asset Details (for property, car, etc.) - Tokenized for privacy
    property_address_token = models.CharField(max_length=50, blank=True, null=True, help_text="Token for encrypted property address")
    property_value_token = models.CharField(max_length=50, blank=True, null=True, help_text="Token for encrypted property value")
    vehicle_make_token = models.CharField(max_length=50, blank=True, null=True, help_text="Token for encrypted vehicle make")
    vehicle_model_token = models.CharField(max_length=50, blank=True, null=True, help_text="Token for encrypted vehicle model")
    vehicle_year_token = models.CharField(max_length=50, blank=True, null=True, help_text="Token for encrypted vehicle year")
    vehicle_value_token = models.CharField(max_length=50, blank=True, null=True, help_text="Token for encrypted vehicle value")

    # Additional Information - Tokenized for privacy
    employment_status = models.CharField(max_length=20, choices=EMPLOYMENT_CHOICES, blank=True, null=True)
    annual_income_token = models.CharField(max_length=50, blank=True, null=True, help_text="Token for encrypted annual income")
    credit_score_token = models.CharField(max_length=50, blank=True, null=True, help_text="Token for encrypted credit score")
    bank_account_token = models.CharField(max_length=50, blank=True, null=True, help_text="Token for encrypted bank account")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)
    due_date = models.DateField(blank=True, null=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        loan_type_display = self.get_loan_type_display()
        return f"Loan #{self.id} - {loan_type_display} - {self.borrower_name} - ${self.amount}"
    
    @property
    def monthly_payment(self):
        """Calculate monthly payment (interest-free)"""
        return float(self.amount) / self.term if self.term > 0 else 0
    
    @property
    def total_paid(self):
        """Calculate total amount paid so far"""
        return sum(payment.amount for payment in self.payments.filter(status='completed'))
    
    @property
    def remaining_balance(self):
        """Calculate remaining balance"""
        return float(self.amount) - float(self.total_paid)


class Repayment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    PAYMENT_METHOD_CHOICES = [
        ('bank_transfer', 'Bank Transfer'),
        ('credit_card', 'Credit Card'),
        ('debit_card', 'Debit Card'),
    ]

    loan = models.ForeignKey(Loan, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default='bank_transfer')
    notes = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    class Meta:
        ordering = ['-payment_date']

    def __str__(self):
        return f"Payment #{self.id} - Loan #{self.loan.id} - ${self.amount}"


class Verification(models.Model):
    """
    Tracks various verification checks for borrowers.
    Supports ID verification, income verification, bank account verification, and compliance checks.
    """
    VERIFICATION_TYPE_CHOICES = [
        ('identity', 'Identity Verification'),
        ('income', 'Income/Payroll Verification'),
        ('bank_account', 'Bank Account Verification'),
        ('sanctions', 'OFAC/Sanctions Screening'),
        ('fraud', 'Fraud Check'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('verified', 'Verified'),
        ('failed', 'Failed'),
        ('manual_review', 'Manual Review Required'),
    ]

    PROVIDER_CHOICES = [
        ('persona', 'Persona'),
        ('trulioo', 'Trulioo'),
        ('onfido', 'Onfido'),
        ('argyle', 'Argyle'),
        ('plaid', 'Plaid'),
        ('finicity', 'Finicity'),
        ('internal', 'Internal/Manual'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='verifications')
    loan = models.ForeignKey(Loan, on_delete=models.CASCADE, related_name='verifications', null=True, blank=True)

    verification_type = models.CharField(max_length=20, choices=VERIFICATION_TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    provider = models.CharField(max_length=20, choices=PROVIDER_CHOICES, default='internal')

    # External provider details
    external_verification_id = models.CharField(max_length=255, blank=True, null=True, help_text="ID from external verification provider")
    verification_url = models.URLField(blank=True, null=True, help_text="URL for user to complete verification")

    # Verification data
    verification_data = models.JSONField(default=dict, blank=True, help_text="Stores verification response data")

    # Results
    verified_at = models.DateTimeField(null=True, blank=True)
    failed_reason = models.TextField(blank=True, null=True)
    reviewer_notes = models.TextField(blank=True, null=True, help_text="For manual review notes")
    reviewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviewed_verifications')

    # Consent
    user_consent = models.BooleanField(default=False, help_text="User consent for verification")
    consent_timestamp = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'verification_type']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return f"{self.get_verification_type_display()} - {self.user.username} - {self.status}"

    def is_verified(self):
        """Check if verification is successfully completed"""
        return self.status == 'verified'

    def requires_action(self):
        """Check if user action is required"""
        return self.status in ['pending', 'in_progress']


class SupportTicket(models.Model):
    """
    Support ticket system for user inquiries and issues
    """
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('waiting_customer', 'Waiting on Customer'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]

    CATEGORY_CHOICES = [
        ('general', 'General Inquiry'),
        ('loan_application', 'Loan Application'),
        ('payment', 'Payment Issue'),
        ('verification', 'Verification'),
        ('technical', 'Technical Issue'),
        ('complaint', 'Complaint'),
        ('other', 'Other'),
    ]

    # Ticket Details
    ticket_number = models.CharField(max_length=20, unique=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='support_tickets')
    subject = models.CharField(max_length=200)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='general')
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')

    # Assignment
    assigned_to = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_tickets'
    )

    # Related loan (optional)
    loan = models.ForeignKey(Loan, on_delete=models.SET_NULL, null=True, blank=True, related_name='support_tickets')

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['status', 'priority']),
        ]

    def __str__(self):
        return f"Ticket #{self.ticket_number} - {self.subject}"

    def save(self, *args, **kwargs):
        if not self.ticket_number:
            # Generate unique ticket number
            import uuid
            self.ticket_number = f"TKT-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)


class SupportTicketMessage(models.Model):
    """
    Messages/replies within a support ticket
    """
    ticket = models.ForeignKey(SupportTicket, on_delete=models.CASCADE, related_name='messages')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    is_staff_reply = models.BooleanField(default=False)

    # Attachments
    attachment = models.FileField(upload_to='support_attachments/%Y/%m/', null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Message on {self.ticket.ticket_number} by {self.user.username}"


class AuditLog(models.Model):
    """
    Audit logging for security events and important actions
    """
    ACTION_CHOICES = [
        ('login', 'User Login'),
        ('logout', 'User Logout'),
        ('login_failed', 'Failed Login Attempt'),
        ('password_change', 'Password Changed'),
        ('profile_update', 'Profile Updated'),
        ('loan_created', 'Loan Application Created'),
        ('loan_approved', 'Loan Approved'),
        ('loan_rejected', 'Loan Rejected'),
        ('payment_made', 'Payment Made'),
        ('document_uploaded', 'Document Uploaded'),
        ('verification_initiated', 'Verification Initiated'),
        ('verification_completed', 'Verification Completed'),
        ('data_export', 'Data Export Requested'),
        ('support_ticket_created', 'Support Ticket Created'),
        ('admin_action', 'Admin Action'),
    ]

    SEVERITY_CHOICES = [
        ('info', 'Info'),
        ('warning', 'Warning'),
        ('error', 'Error'),
        ('critical', 'Critical'),
    ]

    # Who & What
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=30, choices=ACTION_CHOICES)
    severity = models.CharField(max_length=10, choices=SEVERITY_CHOICES, default='info')
    description = models.TextField(blank=True)

    # Context
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=255, blank=True)
    metadata = models.JSONField(default=dict, blank=True, help_text="Additional context data")

    # Related objects
    loan = models.ForeignKey(Loan, on_delete=models.SET_NULL, null=True, blank=True)
    support_ticket = models.ForeignKey(SupportTicket, on_delete=models.SET_NULL, null=True, blank=True)

    # Timestamp
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'action']),
            models.Index(fields=['action', 'created_at']),
            models.Index(fields=['severity']),
        ]

    def __str__(self):
        user_info = self.user.username if self.user else 'Anonymous'
        return f"{self.get_action_display()} by {user_info} at {self.created_at}"


class TokenVault(models.Model):
    """
    Secure vault for storing tokenized sensitive data
    Uses AWS KMS envelope encryption for maximum security
    """
    # The token (what gets stored in Loan/User tables)
    token = models.CharField(
        max_length=50,
        unique=True,
        db_index=True,
        help_text="Token reference (e.g., tok_abc123)"
    )

    # Encrypted data (envelope encrypted with KMS data key)
    encrypted_value = models.TextField(help_text="AES-256 encrypted data")

    # Encrypted data key (encrypted by KMS master key)
    encrypted_data_key = models.TextField(help_text="KMS-encrypted data encryption key")

    # Metadata
    field_type = models.CharField(
        max_length=20,
        db_index=True,
        help_text="Type of data (ssn, income, bank_account, etc.)"
    )

    # Ownership
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_tokens'
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    last_accessed_at = models.DateTimeField(null=True, blank=True)

    # Access tracking
    access_count = models.IntegerField(default=0)

    # Security
    is_revoked = models.BooleanField(default=False, help_text="Token revoked for security")
    revoked_at = models.DateTimeField(null=True, blank=True)
    revoked_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='revoked_tokens'
    )
    revoked_reason = models.TextField(blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['token']),
            models.Index(fields=['field_type']),
            models.Index(fields=['created_by', 'field_type']),
            models.Index(fields=['is_revoked']),
        ]

    def __str__(self):
        return f"Token {self.token} ({self.field_type})"

    def revoke(self, user, reason=""):
        """Revoke this token for security purposes"""
        from django.utils import timezone
        self.is_revoked = True
        self.revoked_at = timezone.now()
        self.revoked_by = user
        self.revoked_reason = reason
        self.save()


class TokenAccessLog(models.Model):
    """
    Audit log for all token access (for compliance)
    Tracks who accessed what token and when
    """
    ACCESS_TYPE_CHOICES = [
        ('create', 'Token Created'),
        ('read', 'Token Read/Detokenized'),
        ('revoke', 'Token Revoked'),
        ('failed', 'Access Failed'),
    ]

    token = models.CharField(max_length=50, db_index=True)
    field_type = models.CharField(max_length=20, blank=True)

    accessed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    accessed_at = models.DateTimeField(auto_now_add=True)

    access_type = models.CharField(max_length=20, choices=ACCESS_TYPE_CHOICES)

    # Context
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=255, blank=True)

    # Result
    success = models.BooleanField(default=True)
    error_message = models.TextField(blank=True)

    class Meta:
        ordering = ['-accessed_at']
        indexes = [
            models.Index(fields=['token', 'accessed_at']),
            models.Index(fields=['accessed_by', 'access_type']),
            models.Index(fields=['field_type', 'accessed_at']),
        ]

    def __str__(self):
        user = self.accessed_by.username if self.accessed_by else 'Anonymous'
        return f"{self.access_type} by {user} at {self.accessed_at}"