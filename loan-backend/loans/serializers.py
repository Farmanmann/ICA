from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Loan, Repayment, UserProfile, LoanDocument, Verification, SupportTicket, SupportTicketMessage
from .token_service import TokenService

# ============= USER SERIALIZERS =============
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True, min_length=8)
    role = serializers.ChoiceField(choices=UserProfile.ROLE_CHOICES, default='borrower')
    phone = serializers.CharField(required=False, allow_blank=True, write_only=True)

    # Lender-specific fields
    lender_type = serializers.ChoiceField(
        choices=UserProfile.LENDER_TYPE_CHOICES,
        required=False,
        allow_null=True,
        write_only=True
    )
    organization = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True,
        write_only=True,
        max_length=255
    )

    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password2',
            'first_name', 'last_name', 'role', 'phone',
            'lender_type', 'organization'
        ]

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwords don't match"})

        # Validate lender-specific fields
        role = attrs.get('role', 'borrower')
        if role == 'lender':
            lender_type = attrs.get('lender_type')
            organization = attrs.get('organization')

            # If lender is organization type, organization name is required
            if lender_type == 'organization' and not organization:
                raise serializers.ValidationError({
                    "organization": "Organization name is required for organizational lenders"
                })

        return attrs

    def validate_email(self, value):
        """Ensure email is unique"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_username(self, value):
        """Ensure username is unique"""
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value

    def create(self, validated_data):
        validated_data.pop('password2')
        role = validated_data.pop('role', 'borrower')
        phone = validated_data.pop('phone', '')
        lender_type = validated_data.pop('lender_type', None)
        organization = validated_data.pop('organization', None)

        # Create user (initially inactive - will be activated after email verification)
        user = User.objects.create_user(**validated_data)
        user.is_active = False  # Require email verification
        user.save()

        # Tokenize phone if provided
        phone_token = None
        if phone:
            try:
                token_service = TokenService()
                request = self.context.get('request')
                phone_token = token_service.tokenize(
                    phone,
                    'phone',
                    created_by=user,
                    request=request
                )
            except Exception:
                # If tokenization fails, skip it
                pass

        # Create profile with lender-specific fields
        UserProfile.objects.create(
            user=user,
            role=role,
            phone_token=phone_token,
            lender_type=lender_type if role == 'lender' else None,
            organization=organization if role == 'lender' else None
        )

        return user


# ============= DOCUMENT SERIALIZERS =============
class LoanDocumentSerializer(serializers.ModelSerializer):
    document_type_display = serializers.CharField(source='get_document_type_display', read_only=True)
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = LoanDocument
        fields = '__all__'
        read_only_fields = ['uploaded_at']
    
    def get_file_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
        return None


# ============= REPAYMENT SERIALIZERS =============
class RepaymentSerializer(serializers.ModelSerializer):
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    loan_borrower = serializers.CharField(source='loan.borrower_name', read_only=True)
    
    class Meta:
        model = Repayment
        fields = [
            'id', 'loan', 'loan_borrower', 'amount', 'payment_date', 
            'status', 'status_display', 'payment_method', 'payment_method_display',
            'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'payment_date']


class RepaymentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Repayment
        fields = ['loan', 'amount', 'payment_method', 'notes']
    
    def validate(self, attrs):
        loan = attrs.get('loan')
        if loan.status != 'Approved':
            raise serializers.ValidationError("Can only make payments on approved loans")
        
        amount = attrs.get('amount')
        if amount <= 0:
            raise serializers.ValidationError({"amount": "Amount must be greater than 0"})
        
        if amount > loan.remaining_balance:
            raise serializers.ValidationError({
                "amount": f"Amount exceeds remaining balance of ${loan.remaining_balance}"
            })
        
        return attrs


# ============= LOAN SERIALIZERS =============
class LoanListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing loans (no sensitive data)"""
    monthly_payment = serializers.ReadOnlyField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    loan_type_display = serializers.CharField(source='get_loan_type_display', read_only=True)
    purpose_display = serializers.CharField(source='get_purpose_display', read_only=True)

    class Meta:
        model = Loan
        fields = [
            'id', 'borrower_name', 'email', 'amount', 'term',
            'status', 'status_display', 'loan_type', 'loan_type_display',
            'purpose', 'purpose_display',
            'created_at', 'monthly_payment'
        ]


class LoanDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer with all loan info and detokenization"""
    monthly_payment = serializers.ReadOnlyField()
    total_paid = serializers.ReadOnlyField()
    remaining_balance = serializers.ReadOnlyField()
    payments = RepaymentSerializer(many=True, read_only=True)
    documents = LoanDocumentSerializer(many=True, read_only=True)
    stats = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    purpose_display = serializers.CharField(source='get_purpose_display', read_only=True)
    loan_type_display = serializers.CharField(source='get_loan_type_display', read_only=True)

    # Detokenized fields (read-only, only for authorized users)
    phone = serializers.SerializerMethodField()
    address = serializers.SerializerMethodField()
    ssn = serializers.SerializerMethodField()
    property_address = serializers.SerializerMethodField()
    property_value = serializers.SerializerMethodField()
    vehicle_make = serializers.SerializerMethodField()
    vehicle_model = serializers.SerializerMethodField()
    vehicle_year = serializers.SerializerMethodField()
    vehicle_value = serializers.SerializerMethodField()
    annual_income = serializers.SerializerMethodField()
    credit_score = serializers.SerializerMethodField()
    bank_account = serializers.SerializerMethodField()

    class Meta:
        model = Loan
        fields = [
            'id', 'borrower', 'borrower_name', 'email',
            'phone', 'address', 'ssn',
            'loan_type', 'loan_type_display', 'amount', 'term', 'status', 'status_display',
            'purpose', 'purpose_display', 'due_date',
            'property_address', 'property_value',
            'vehicle_make', 'vehicle_model', 'vehicle_year', 'vehicle_value',
            'employment_status', 'annual_income', 'credit_score', 'bank_account',
            'monthly_payment', 'total_paid', 'remaining_balance',
            'payments', 'documents', 'stats',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def get_stats(self, obj):
        return obj.calculate_stats()

    def _detokenize_field(self, obj, token_field_name):
        """Helper to detokenize a field if user is authorized"""
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return None

        # Check if user is authorized (owner, admin, or staff)
        is_authorized = (
            request.user.is_staff or
            request.user.is_superuser or
            obj.borrower == request.user
        )

        if not is_authorized:
            return None

        # Get the token
        token = getattr(obj, token_field_name, None)
        if not token:
            return None

        try:
            token_service = TokenService()
            return token_service.detokenize(
                token,
                accessed_by=request.user,
                request=request
            )
        except Exception as e:
            # Log error but don't expose to user
            return None

    def get_phone(self, obj):
        return self._detokenize_field(obj, 'phone_token')

    def get_address(self, obj):
        return self._detokenize_field(obj, 'address_token')

    def get_ssn(self, obj):
        return self._detokenize_field(obj, 'ssn_token')

    def get_property_address(self, obj):
        return self._detokenize_field(obj, 'property_address_token')

    def get_property_value(self, obj):
        return self._detokenize_field(obj, 'property_value_token')

    def get_vehicle_make(self, obj):
        return self._detokenize_field(obj, 'vehicle_make_token')

    def get_vehicle_model(self, obj):
        return self._detokenize_field(obj, 'vehicle_model_token')

    def get_vehicle_year(self, obj):
        return self._detokenize_field(obj, 'vehicle_year_token')

    def get_vehicle_value(self, obj):
        return self._detokenize_field(obj, 'vehicle_value_token')

    def get_annual_income(self, obj):
        return self._detokenize_field(obj, 'annual_income_token')

    def get_credit_score(self, obj):
        return self._detokenize_field(obj, 'credit_score_token')

    def get_bank_account(self, obj):
        return self._detokenize_field(obj, 'bank_account_token')


class LoanCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating/applying for loans with tokenization"""
    # Accept plaintext sensitive data
    phone = serializers.CharField(required=False, allow_blank=True, write_only=True)
    address = serializers.CharField(required=False, allow_blank=True, write_only=True)
    ssn = serializers.CharField(required=False, allow_blank=True, write_only=True)
    property_address = serializers.CharField(required=False, allow_blank=True, write_only=True)
    property_value = serializers.DecimalField(required=False, allow_null=True, max_digits=12, decimal_places=2, write_only=True)
    vehicle_make = serializers.CharField(required=False, allow_blank=True, write_only=True)
    vehicle_model = serializers.CharField(required=False, allow_blank=True, write_only=True)
    vehicle_year = serializers.IntegerField(required=False, allow_null=True, write_only=True)
    vehicle_value = serializers.DecimalField(required=False, allow_null=True, max_digits=12, decimal_places=2, write_only=True)
    annual_income = serializers.DecimalField(required=False, allow_null=True, max_digits=12, decimal_places=2, write_only=True)
    credit_score = serializers.IntegerField(required=False, allow_null=True, write_only=True)
    bank_account = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = Loan
        fields = [
            'borrower_name', 'email', 'phone', 'address', 'ssn',
            'loan_type', 'amount', 'term', 'purpose',
            'property_address', 'property_value',
            'vehicle_make', 'vehicle_model', 'vehicle_year', 'vehicle_value',
            'employment_status', 'annual_income', 'credit_score', 'bank_account'
        ]

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Loan amount must be greater than 0")
        if value > 10000000:  # 10 million max
            raise serializers.ValidationError("Loan amount exceeds maximum allowed")
        return value

    def validate_term(self, value):
        if value < 6:
            raise serializers.ValidationError("Minimum loan term is 6 months")
        if value > 360:  # 30 years
            raise serializers.ValidationError("Maximum loan term is 360 months (30 years)")
        return value

    def create(self, validated_data):
        # Initialize token service
        token_service = TokenService()
        request = self.context.get('request')

        # Extract and tokenize sensitive fields
        sensitive_fields = {
            'phone': 'phone',
            'address': 'address',
            'ssn': 'ssn',
            'property_address': 'property_address',
            'property_value': 'property_value',
            'vehicle_make': 'vehicle_make',
            'vehicle_model': 'vehicle_model',
            'vehicle_year': 'vehicle_year',
            'vehicle_value': 'vehicle_value',
            'annual_income': 'income',
            'credit_score': 'credit_score',
            'bank_account': 'bank_account',
        }

        # Tokenize each sensitive field
        for field_name, field_type in sensitive_fields.items():
            if field_name in validated_data and validated_data[field_name]:
                plaintext_value = str(validated_data.pop(field_name))

                # Create token
                token = token_service.tokenize(
                    plaintext_value,
                    field_type,
                    created_by=request.user if request and request.user.is_authenticated else None,
                    request=request
                )

                # Store token in the model
                validated_data[f'{field_name}_token'] = token
            elif field_name in validated_data:
                # Remove empty field
                validated_data.pop(field_name)

        # Set borrower from request user if authenticated
        if request and request.user.is_authenticated:
            validated_data['borrower'] = request.user

        # Status defaults to Pending
        validated_data['status'] = 'Pending'

        return super().create(validated_data)


# ============= STATISTICS SERIALIZERS =============
class DashboardStatsSerializer(serializers.Serializer):
    total_loans = serializers.IntegerField()
    active_loans = serializers.IntegerField()
    pending_loans = serializers.IntegerField()
    rejected_loans = serializers.IntegerField()
    total_borrowed = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_paid = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_remaining = serializers.DecimalField(max_digits=12, decimal_places=2)
    payment_progress = serializers.FloatField()


class LoanCalculatorSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    term = serializers.IntegerField()
    monthly_payment = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_repayment = serializers.DecimalField(max_digits=12, decimal_places=2)
    interest = serializers.DecimalField(max_digits=12, decimal_places=2)


# ============= VERIFICATION SERIALIZERS =============
class VerificationSerializer(serializers.ModelSerializer):
    verification_type_display = serializers.CharField(source='get_verification_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    provider_display = serializers.CharField(source='get_provider_display', read_only=True)
    is_verified = serializers.BooleanField(read_only=True)
    requires_action = serializers.BooleanField(read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = Verification
        fields = [
            'id', 'user', 'user_email', 'user_name', 'loan',
            'verification_type', 'verification_type_display',
            'status', 'status_display', 'provider', 'provider_display',
            'external_verification_id', 'verification_url',
            'verified_at', 'failed_reason', 'reviewer_notes',
            'user_consent', 'consent_timestamp',
            'is_verified', 'requires_action',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at', 'verified_at']

    def get_user_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username


class VerificationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Verification
        fields = [
            'verification_type', 'provider', 'user_consent', 'loan'
        ]

    def validate(self, attrs):
        if not attrs.get('user_consent'):
            raise serializers.ValidationError({
                "user_consent": "User consent is required to perform verification"
            })
        return attrs

    def create(self, validated_data):
        # Set user from request
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['user'] = request.user
            from django.utils import timezone
            validated_data['consent_timestamp'] = timezone.now()
        return super().create(validated_data)


class VerificationUpdateSerializer(serializers.ModelSerializer):
    """For updating verification status (admin/internal use)"""
    class Meta:
        model = Verification
        fields = [
            'status', 'external_verification_id', 'verification_url',
            'verification_data', 'failed_reason', 'reviewer_notes'
        ]

# ============= SUPPORT TICKET SERIALIZERS =============
class SupportTicketMessageSerializer(serializers.ModelSerializer):
    """Serializer for support ticket messages"""
    user_name = serializers.SerializerMethodField()
    
    class Meta:
        model = SupportTicketMessage
        fields = [
            'id', 'ticket', 'user', 'user_name', 'message',
            'is_staff_reply', 'attachment', 'created_at'
        ]
        read_only_fields = ['created_at', 'user']
    
    def get_user_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username


class SupportTicketListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing support tickets"""
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    message_count = serializers.SerializerMethodField()
    
    class Meta:
        model = SupportTicket
        fields = [
            'id', 'ticket_number', 'subject', 'category', 'category_display',
            'status', 'status_display', 'priority', 'priority_display',
            'created_at', 'message_count'
        ]
    
    def get_message_count(self, obj):
        return obj.messages.count()


class SupportTicketDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer with all ticket info and messages"""
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    messages = SupportTicketMessageSerializer(many=True, read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_name = serializers.SerializerMethodField()
    assigned_to_name = serializers.SerializerMethodField()
    
    class Meta:
        model = SupportTicket
        fields = [
            'id', 'ticket_number', 'user', 'user_email', 'user_name',
            'subject', 'category', 'category_display', 'description',
            'status', 'status_display', 'priority', 'priority_display',
            'assigned_to', 'assigned_to_name', 'loan',
            'created_at', 'updated_at', 'resolved_at',
            'messages'
        ]
        read_only_fields = ['ticket_number', 'created_at', 'updated_at', 'resolved_at']
    
    def get_user_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username
    
    def get_assigned_to_name(self, obj):
        if obj.assigned_to:
            return f"{obj.assigned_to.first_name} {obj.assigned_to.last_name}".strip() or obj.assigned_to.username
        return None


class SupportTicketCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating support tickets"""
    class Meta:
        model = SupportTicket
        fields = ['subject', 'category', 'description', 'priority', 'loan']
    
    def create(self, validated_data):
        # Set user from request
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['user'] = request.user
        return super().create(validated_data)


class SupportTicketMessageCreateSerializer(serializers.ModelSerializer):
    """Serializer for adding messages to tickets"""
    class Meta:
        model = SupportTicketMessage
        fields = ['ticket', 'message', 'attachment']
    
    def create(self, validated_data):
        # Set user from request
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['user'] = request.user
            # Mark as staff reply if user is staff
            validated_data['is_staff_reply'] = request.user.is_staff
        return super().create(validated_data)
