from django.contrib import admin
from .models import (
    Loan, Repayment, UserProfile, LoanDocument, Verification,
    SupportTicket, SupportTicketMessage, AuditLog,
    TokenVault, TokenAccessLog
)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'role', 'employment_status', 'created_at']
    list_filter = ['role', 'employment_status', 'created_at']
    search_fields = ['user__username', 'user__email', 'phone_token', 'national_id_token']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('User Info', {
            'fields': ('user', 'role')
        }),
        ('Tokenized Contact Information', {
            'fields': ('phone_token', 'address_token', 'date_of_birth', 'national_id_token')
        }),
        ('Tokenized Financial Information', {
            'fields': ('employment_status', 'annual_income_token', 'credit_score_token')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

class LoanDocumentInline(admin.TabularInline):
    model = LoanDocument
    extra = 0
    fields = ['document_type', 'file', 'uploaded_at', 'notes']
    readonly_fields = ['uploaded_at']


@admin.register(Loan)
class LoanAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'borrower_name',
        'loan_type',
        'purpose',
        'amount',
        'term',
        'status',
        'created_at'
    ]
    inlines = [LoanDocumentInline]

    list_filter = ['status', 'loan_type', 'purpose', 'employment_status', 'created_at']
    search_fields = ['borrower_name', 'email']
    readonly_fields = ['created_at', 'updated_at', 'monthly_payment', 'total_paid', 'remaining_balance']

    fieldsets = (
        ('Personal Information', {
            'fields': ('borrower', 'borrower_name', 'email', 'phone_token', 'address_token', 'ssn_token')
        }),
        ('Loan Details', {
            'fields': ('loan_type', 'amount', 'term', 'status', 'purpose', 'due_date')
        }),
        ('Property Details - Tokenized', {
            'fields': ('property_address_token', 'property_value_token'),
            'classes': ('collapse',),
            'description': 'Fill this section for property-related loans'
        }),
        ('Vehicle Details - Tokenized', {
            'fields': ('vehicle_make_token', 'vehicle_model_token', 'vehicle_year_token', 'vehicle_value_token'),
            'classes': ('collapse',),
            'description': 'Fill this section for car loans'
        }),
        ('Additional Information - Tokenized', {
            'fields': ('employment_status', 'annual_income_token', 'credit_score_token', 'bank_account_token')
        }),
        ('Calculated Fields', {
            'fields': ('monthly_payment', 'total_paid', 'remaining_balance'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    actions = ['approve_loans', 'reject_loans']
    
    def approve_loans(self, request, queryset):
        updated = queryset.update(status='Approved')
        self.message_user(request, f'{updated} loan(s) approved successfully.')
    approve_loans.short_description = 'Approve selected loans'
    
    def reject_loans(self, request, queryset):
        updated = queryset.update(status='Rejected')
        self.message_user(request, f'{updated} loan(s) rejected.')
    reject_loans.short_description = 'Reject selected loans'


@admin.register(Repayment)
class RepaymentAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'loan',
        'amount',
        'payment_date',
        'status',
        'payment_method',
        'created_at'
    ]
    list_filter = ['status', 'payment_method', 'payment_date']
    search_fields = ['loan__borrower_name', 'loan__id']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Payment Details', {
            'fields': ('loan', 'amount', 'payment_date', 'status', 'payment_method', 'notes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(LoanDocument)
class LoanDocumentAdmin(admin.ModelAdmin):
    list_display = ['id', 'loan', 'document_type', 'uploaded_at']
    list_filter = ['document_type', 'uploaded_at']
    search_fields = ['loan__borrower_name', 'loan__id', 'notes']
    readonly_fields = ['uploaded_at']


@admin.register(Verification)
class VerificationAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'user',
        'verification_type',
        'status',
        'provider',
        'user_consent',
        'created_at',
        'verified_at'
    ]
    list_filter = ['verification_type', 'status', 'provider', 'user_consent', 'created_at']
    search_fields = ['user__username', 'user__email', 'external_verification_id', 'failed_reason']
    readonly_fields = ['created_at', 'updated_at', 'verified_at', 'consent_timestamp']

    fieldsets = (
        ('User & Loan Information', {
            'fields': ('user', 'loan')
        }),
        ('Verification Details', {
            'fields': ('verification_type', 'status', 'provider')
        }),
        ('External Provider Info', {
            'fields': ('external_verification_id', 'verification_url'),
            'classes': ('collapse',)
        }),
        ('Results & Review', {
            'fields': ('verified_at', 'failed_reason', 'reviewer_notes', 'reviewed_by')
        }),
        ('Consent', {
            'fields': ('user_consent', 'consent_timestamp'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    actions = ['approve_verifications', 'reject_verifications', 'mark_manual_review']

    def approve_verifications(self, request, queryset):
        from django.utils import timezone
        updated = queryset.update(status='verified', verified_at=timezone.now())
        self.message_user(request, f'{updated} verification(s) approved successfully.')
    approve_verifications.short_description = 'Approve selected verifications'

    def reject_verifications(self, request, queryset):
        updated = queryset.update(status='failed', failed_reason='Rejected by admin')
        self.message_user(request, f'{updated} verification(s) rejected.')
    reject_verifications.short_description = 'Reject selected verifications'

    def mark_manual_review(self, request, queryset):
        updated = queryset.update(status='manual_review')
        self.message_user(request, f'{updated} verification(s) marked for manual review.')
    mark_manual_review.short_description = 'Mark for manual review'


class SupportTicketMessageInline(admin.TabularInline):
    model = SupportTicketMessage
    extra = 0
    fields = ['user', 'message', 'is_staff_reply', 'attachment', 'created_at']
    readonly_fields = ['created_at']


@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
    list_display = [
        'ticket_number',
        'user',
        'subject',
        'category',
        'status',
        'priority',
        'assigned_to',
        'created_at',
        'resolved_at'
    ]
    inlines = [SupportTicketMessageInline]
    list_filter = ['status', 'priority', 'category', 'created_at']
    search_fields = ['ticket_number', 'user__username', 'user__email', 'subject', 'description']
    readonly_fields = ['ticket_number', 'created_at', 'updated_at', 'resolved_at']

    fieldsets = (
        ('Ticket Information', {
            'fields': ('ticket_number', 'user', 'loan')
        }),
        ('Details', {
            'fields': ('subject', 'category', 'description', 'status', 'priority')
        }),
        ('Assignment', {
            'fields': ('assigned_to',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'resolved_at'),
            'classes': ('collapse',)
        }),
    )

    actions = ['mark_in_progress', 'mark_resolved', 'mark_closed']

    def mark_in_progress(self, request, queryset):
        updated = queryset.update(status='in_progress')
        self.message_user(request, f'{updated} ticket(s) marked as in progress.')
    mark_in_progress.short_description = 'Mark as In Progress'

    def mark_resolved(self, request, queryset):
        from django.utils import timezone
        updated = queryset.update(status='resolved', resolved_at=timezone.now())
        self.message_user(request, f'{updated} ticket(s) marked as resolved.')
    mark_resolved.short_description = 'Mark as Resolved'

    def mark_closed(self, request, queryset):
        updated = queryset.update(status='closed')
        self.message_user(request, f'{updated} ticket(s) closed.')
    mark_closed.short_description = 'Close Tickets'


@admin.register(SupportTicketMessage)
class SupportTicketMessageAdmin(admin.ModelAdmin):
    list_display = ['ticket', 'user', 'is_staff_reply', 'created_at']
    list_filter = ['is_staff_reply', 'created_at']
    search_fields = ['ticket__ticket_number', 'user__username', 'message']
    readonly_fields = ['created_at']


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'user',
        'action',
        'severity',
        'ip_address',
        'created_at'
    ]
    list_filter = ['action', 'severity', 'created_at']
    search_fields = ['user__username', 'user__email', 'description', 'ip_address']
    readonly_fields = ['created_at']

    fieldsets = (
        ('Event Information', {
            'fields': ('user', 'action', 'severity', 'description')
        }),
        ('Context', {
            'fields': ('ip_address', 'user_agent', 'metadata')
        }),
        ('Related Objects', {
            'fields': ('loan', 'support_ticket'),
            'classes': ('collapse',)
        }),
        ('Timestamp', {
            'fields': ('created_at',)
        }),
    )

    # Make audit logs read-only
    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser  # Only superusers can delete audit logs

    def has_change_permission(self, request, obj=None):
        return False  # Audit logs should not be edited


@admin.register(TokenVault)
class TokenVaultAdmin(admin.ModelAdmin):
    list_display = [
        'token',
        'field_type',
        'created_by',
        'created_at',
        'access_count',
        'is_revoked'
    ]
    list_filter = ['field_type', 'is_revoked', 'created_at']
    search_fields = ['token', 'field_type', 'created_by__username']
    readonly_fields = [
        'token',
        'encrypted_value',
        'encrypted_data_key',
        'created_at',
        'last_accessed_at',
        'access_count',
        'revoked_at',
        'revoked_by'
    ]

    fieldsets = (
        ('Token Information', {
            'fields': ('token', 'field_type')
        }),
        ('Encrypted Data (Read-Only)', {
            'fields': ('encrypted_value', 'encrypted_data_key'),
            'classes': ('collapse',)
        }),
        ('Ownership', {
            'fields': ('created_by', 'created_at')
        }),
        ('Access Tracking', {
            'fields': ('last_accessed_at', 'access_count')
        }),
        ('Revocation', {
            'fields': ('is_revoked', 'revoked_at', 'revoked_by', 'revoked_reason')
        }),
    )

    actions = ['revoke_tokens']

    def revoke_tokens(self, request, queryset):
        for token_entry in queryset:
            if not token_entry.is_revoked:
                token_entry.revoke(request.user, "Revoked by admin")
        self.message_user(request, f'{queryset.count()} token(s) revoked.')
    revoke_tokens.short_description = 'Revoke selected tokens'

    # Restrict modifications
    def has_add_permission(self, request):
        return False  # Tokens created programmatically only

    def has_delete_permission(self, request, obj=None):
        # Only superusers can delete tokens (dangerous!)
        return request.user.is_superuser


@admin.register(TokenAccessLog)
class TokenAccessLogAdmin(admin.ModelAdmin):
    list_display = [
        'token',
        'field_type',
        'access_type',
        'accessed_by',
        'accessed_at',
        'success',
        'ip_address'
    ]
    list_filter = ['access_type', 'field_type', 'success', 'accessed_at']
    search_fields = ['token', 'accessed_by__username', 'ip_address']
    readonly_fields = [
        'token',
        'field_type',
        'accessed_by',
        'accessed_at',
        'access_type',
        'ip_address',
        'user_agent',
        'success',
        'error_message'
    ]

    fieldsets = (
        ('Token Access', {
            'fields': ('token', 'field_type', 'access_type')
        }),
        ('User Information', {
            'fields': ('accessed_by', 'accessed_at')
        }),
        ('Context', {
            'fields': ('ip_address', 'user_agent')
        }),
        ('Result', {
            'fields': ('success', 'error_message')
        }),
    )

    # Make logs read-only
    def has_add_permission(self, request):
        return False  # Logs created automatically

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser  # Only superusers can delete logs

    def has_change_permission(self, request, obj=None):
        return False  # Logs should not be edited