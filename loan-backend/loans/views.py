from rest_framework import viewsets, status, filters
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth.models import User
from django.db.models import Sum, Q, Count, Avg
from decimal import Decimal, InvalidOperation

from .models import Loan, Repayment, UserProfile, LoanDocument, Verification, SupportTicket, SupportTicketMessage
from .serializers import (
    LoanListSerializer, LoanDetailSerializer, LoanCreateSerializer,
    RepaymentSerializer, RepaymentCreateSerializer,
    UserSerializer, UserProfileSerializer, UserRegistrationSerializer,
    LoanDocumentSerializer, DashboardStatsSerializer, LoanCalculatorSerializer,
    VerificationSerializer, VerificationCreateSerializer, VerificationUpdateSerializer,
    SupportTicketListSerializer, SupportTicketDetailSerializer, SupportTicketCreateSerializer,
    SupportTicketMessageSerializer, SupportTicketMessageCreateSerializer
)


# ============= AUTHENTICATION & USER VIEWS =============
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """
    User registration endpoint.
    Creates user account and sends email verification link.
    """
    serializer = UserRegistrationSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        user = serializer.save()

        # Send verification email
        from .auth_utils import send_verification_email
        email_sent = send_verification_email(user, request)

        return Response({
            'message': 'User registered successfully. Please check your email to verify your account.',
            'email_sent': email_sent,
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_email(request):
    """
    Verify user's email address using token from email link.

    Expected data:
    - uid: Base64 encoded user ID
    - token: Email verification token
    """
    from .auth_utils import verify_email_token
    from django.utils import timezone

    uid = request.data.get('uid')
    token = request.data.get('token')

    if not uid or not token:
        return Response(
            {'error': 'Missing uid or token'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = verify_email_token(uid, token)

    if user is None:
        return Response(
            {'error': 'Invalid or expired verification link'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Mark email as verified
    profile, created = UserProfile.objects.get_or_create(user=user)
    profile.email_verified = True
    profile.email_verified_at = timezone.now()
    profile.save()

    # Activate user account if not already active
    if not user.is_active:
        user.is_active = True
        user.save()

    return Response({
        'message': 'Email verified successfully. You can now log in.',
        'user': UserSerializer(user).data
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def resend_verification_email(request):
    """
    Resend email verification link.

    Expected data:
    - email: User's email address
    """
    from .auth_utils import send_verification_email

    email = request.data.get('email')

    if not email:
        return Response(
            {'error': 'Email address is required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.get(email=email)
        profile = user.profile

        # Check if already verified
        if profile.email_verified:
            return Response(
                {'message': 'Email already verified'},
                status=status.HTTP_200_OK
            )

        # Send verification email
        email_sent = send_verification_email(user, request)

        if email_sent:
            return Response(
                {'message': 'Verification email sent successfully'},
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {'error': 'Failed to send verification email'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    except User.DoesNotExist:
        # Don't reveal if user exists or not for security
        return Response(
            {'message': 'If an account with this email exists, a verification link has been sent.'},
            status=status.HTTP_200_OK
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def request_password_reset(request):
    """
    Request password reset link.

    Expected data:
    - email: User's email address
    """
    from .auth_utils import send_password_reset_email

    email = request.data.get('email')

    if not email:
        return Response(
            {'error': 'Email address is required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.get(email=email)

        # Send password reset email
        email_sent = send_password_reset_email(user, request)

        # Always return success to prevent email enumeration
        return Response(
            {'message': 'If an account with this email exists, a password reset link has been sent.'},
            status=status.HTTP_200_OK
        )

    except User.DoesNotExist:
        # Don't reveal if user exists or not for security
        return Response(
            {'message': 'If an account with this email exists, a password reset link has been sent.'},
            status=status.HTTP_200_OK
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def confirm_password_reset(request):
    """
    Confirm password reset and set new password.

    Expected data:
    - uid: Base64 encoded user ID
    - token: Password reset token
    - new_password: New password
    - confirm_password: Confirmation of new password
    """
    from .auth_utils import verify_password_reset_token
    from django.contrib.auth.password_validation import validate_password
    from django.core.exceptions import ValidationError

    uid = request.data.get('uid')
    token = request.data.get('token')
    new_password = request.data.get('new_password')
    confirm_password = request.data.get('confirm_password')

    # Validate input
    if not all([uid, token, new_password, confirm_password]):
        return Response(
            {'error': 'All fields are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if new_password != confirm_password:
        return Response(
            {'error': 'Passwords do not match'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Verify token
    user = verify_password_reset_token(uid, token)

    if user is None:
        return Response(
            {'error': 'Invalid or expired password reset link'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Validate password strength
    try:
        validate_password(new_password, user=user)
    except ValidationError as e:
        return Response(
            {'error': list(e.messages)},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Set new password
    user.set_password(new_password)
    user.save()

    return Response(
        {'message': 'Password reset successfully. You can now log in with your new password.'},
        status=status.HTTP_200_OK
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    """Get current authenticated user"""
    user_serializer = UserSerializer(request.user)

    # Get or create profile
    profile, created = UserProfile.objects.get_or_create(user=request.user)
    profile_serializer = UserProfileSerializer(profile)

    return Response({
        'user': user_serializer.data,
        'profile': profile_serializer.data
    })


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """Update user profile"""
    profile, created = UserProfile.objects.get_or_create(user=request.user)
    
    # Update User fields if provided
    user_data = {}
    for field in ['first_name', 'last_name', 'email']:
        if field in request.data:
            user_data[field] = request.data[field]
    
    if user_data:
        for key, value in user_data.items():
            setattr(request.user, key, value)
        request.user.save()
    
    # Update Profile fields
    serializer = UserProfileSerializer(profile, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'user': UserSerializer(request.user).data,
            'profile': serializer.data
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ============= LOAN VIEWSET =============
class LoanViewSet(viewsets.ModelViewSet):
    queryset = Loan.objects.all()
    permission_classes = [AllowAny]  # Change to [IsAuthenticated] in production
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'loan_type', 'purpose', 'employment_status']
    search_fields = ['borrower_name', 'email', 'property_address', 'vehicle_make', 'vehicle_model']
    ordering_fields = ['created_at', 'amount', 'status']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return LoanListSerializer
        elif self.action == 'create':
            return LoanCreateSerializer
        return LoanDetailSerializer
    
    def get_queryset(self):
        """Filter loans based on user role"""
        user = self.request.user
        
        # Allow unauthenticated for now (remove in production)
        if not user.is_authenticated:
            return Loan.objects.all()
        
        # Admins see everything
        if user.is_staff:
            return Loan.objects.all()
        
        # Get or create profile
        profile, created = UserProfile.objects.get_or_create(user=user)
        
        if profile.role == 'admin':
            return Loan.objects.all()
        elif profile.role == 'borrower':
            return Loan.objects.filter(Q(borrower=user) | Q(email=user.email))
        elif profile.role == 'lender':
            # Lenders see approved loans
            return Loan.objects.filter(status='Approved')
        
        return Loan.objects.none()
    
    @action(detail=False, methods=['get'])
    def my_loans(self, request):
        """Get current user's loans"""
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Authentication required'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        loans = Loan.objects.filter(Q(borrower=request.user) | Q(email=request.user.email))
        serializer = LoanListSerializer(loans, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve a loan (admin only)"""
        if not request.user.is_staff:
            return Response(
                {'error': 'Only admins can approve loans'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        loan = self.get_object()
        loan.status = 'Approved'
        loan.save()
        
        serializer = LoanDetailSerializer(loan)
        return Response({
            'message': 'Loan approved successfully',
            'loan': serializer.data
        })
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject a loan (admin only)"""
        if not request.user.is_staff:
            return Response(
                {'error': 'Only admins can reject loans'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        loan = self.get_object()
        loan.status = 'Rejected'
        loan.save()
        
        serializer = LoanDetailSerializer(loan)
        return Response({
            'message': 'Loan rejected',
            'loan': serializer.data
        })
    
    @action(detail=True, methods=['get'])
    def stats(self, request, pk=None):
        """Get detailed loan statistics"""
        loan = self.get_object()
        return Response(loan.calculate_stats())
    
    @action(detail=True, methods=['post'])
    def upload_document(self, request, pk=None):
        """Upload document for a loan"""
        loan = self.get_object()
        
        # Check permission
        if request.user.is_authenticated:
            if not (request.user.is_staff or loan.borrower == request.user):
                return Response(
                    {'error': 'Permission denied'},
                    status=status.HTTP_403_FORBIDDEN
                )
        
        data = request.data.copy()
        data['loan'] = loan.id
        
        serializer = LoanDocumentSerializer(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get overall loan statistics"""
        queryset = self.get_queryset()
        
        stats = {
            'total_loans': queryset.count(),
            'approved': queryset.filter(status='Approved').count(),
            'pending': queryset.filter(status='Pending').count(),
            'rejected': queryset.filter(status='Rejected').count(),
            'total_disbursed': queryset.filter(status='Approved').aggregate(
                total=Sum('amount')
            )['total'] or 0,
            'average_loan_size': queryset.filter(status='Approved').aggregate(
                avg=Avg('amount')
            )['avg'] or 0,
            'loans_by_term': list(queryset.values('term').annotate(
                count=Count('id')
            ).order_by('term')),
            'loans_by_purpose': list(queryset.exclude(purpose__isnull=True).values('purpose').annotate(
                count=Count('id')
            )),
        }
        
        return Response(stats)


# ============= REPAYMENT VIEWSET =============
class RepaymentViewSet(viewsets.ModelViewSet):
    queryset = Repayment.objects.all()
    permission_classes = [AllowAny]  # Change to [IsAuthenticated] in production
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['loan', 'status', 'payment_method']
    ordering = ['-payment_date']
    
    def get_serializer_class(self):
        if self.action == 'create' or self.action == 'make_payment':
            return RepaymentCreateSerializer
        return RepaymentSerializer
    
    def get_queryset(self):
        """Filter repayments based on user's loans"""
        user = self.request.user
        queryset = Repayment.objects.all()
        
        # Allow unauthenticated for now
        if not user.is_authenticated:
            return queryset
        
        # Admins see everything
        if user.is_staff:
            return queryset
        
        # Filter by loan_id query param if provided
        loan_id = self.request.query_params.get('loan_id')
        if loan_id:
            return queryset.filter(loan_id=loan_id)
        
        # Get user's loans and filter payments
        user_loans = Loan.objects.filter(Q(borrower=user) | Q(email=user.email))
        return queryset.filter(loan__in=user_loans)
    
    @action(detail=False, methods=['post'])
    def make_payment(self, request):
        """Create a new payment for a loan"""
        serializer = RepaymentCreateSerializer(data=request.data)
        if serializer.is_valid():
            payment = serializer.save(status='completed')
            return Response(
                RepaymentSerializer(payment).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def my_payments(self, request):
        """Get current user's payments"""
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Authentication required'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        payments = self.get_queryset()
        serializer = RepaymentSerializer(payments, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def payment_history(self, request):
        """Get payment history for a specific loan"""
        loan_id = request.query_params.get('loan_id')
        
        if not loan_id:
            return Response(
                {'error': 'loan_id parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        payments = self.get_queryset().filter(loan_id=loan_id)
        serializer = RepaymentSerializer(payments, many=True)
        return Response(serializer.data)


# ============= DASHBOARD & UTILITIES =============
@api_view(['GET'])
@permission_classes([AllowAny])  # Change to [IsAuthenticated] in production
def dashboard_stats(request):
    """Get dashboard statistics for current user"""
    user = request.user
    
    # Allow unauthenticated for testing
    if not user.is_authenticated:
        loans = Loan.objects.all()
    elif user.is_staff:
        loans = Loan.objects.all()
    else:
        loans = Loan.objects.filter(Q(borrower=user) | Q(email=user.email))
    
    active_loans = loans.filter(status='Approved')
    pending_loans = loans.filter(status='Pending')
    rejected_loans = loans.filter(status='Rejected')
    
    total_borrowed = active_loans.aggregate(
        total=Sum('amount')
    )['total'] or Decimal('0')
    
    total_paid = Repayment.objects.filter(
        loan__in=active_loans,
        status='completed'
    ).aggregate(total=Sum('amount'))['total'] or Decimal('0')
    
    total_remaining = total_borrowed - total_paid
    payment_progress = (float(total_paid) / float(total_borrowed) * 100) if total_borrowed > 0 else 0
    
    stats = {
        'total_loans': loans.count(),
        'active_loans': active_loans.count(),
        'pending_loans': pending_loans.count(),
        'rejected_loans': rejected_loans.count(),
        'total_borrowed': total_borrowed,
        'total_paid': total_paid,
        'total_remaining': total_remaining,
        'payment_progress': round(payment_progress, 2),
    }
    
    serializer = DashboardStatsSerializer(stats)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([AllowAny])
def calculate_loan(request):
    """Calculate loan monthly payments"""
    try:
        amount = Decimal(request.data.get('amount', 0))
        term = int(request.data.get('term', 12))
        
        if term <= 0:
            return Response(
                {'error': 'Term must be greater than 0'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if amount <= 0:
            return Response(
                {'error': 'Amount must be greater than 0'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        monthly_payment = amount / term
        
        result = {
            'amount': amount,
            'term': term,
            'monthly_payment': round(monthly_payment, 2),
            'total_repayment': amount,
            'interest': Decimal('0'),  # Interest-free
        }
        
        serializer = LoanCalculatorSerializer(result)
        return Response(serializer.data)
    
    except (ValueError, TypeError, InvalidOperation):
        return Response(
            {'error': 'Invalid input values'},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET'])
@permission_classes([AllowAny])
def loan_options(request):
    """Get available loan types and purposes"""
    return Response({
        'loan_types': [
            {'value': choice[0], 'label': choice[1]}
            for choice in Loan.LOAN_TYPE_CHOICES
        ],
        'purposes': [
            {'value': choice[0], 'label': choice[1]}
            for choice in Loan.PURPOSE_CHOICES
        ],
    })


# ============= VERIFICATION VIEWSET =============
class VerificationViewSet(viewsets.ModelViewSet):
    queryset = Verification.objects.all()
    permission_classes = [AllowAny]  # Change to [IsAuthenticated] in production
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['verification_type', 'status', 'provider', 'user']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'create' or self.action == 'initiate':
            return VerificationCreateSerializer
        elif self.action in ['update', 'partial_update', 'update_status']:
            return VerificationUpdateSerializer
        return VerificationSerializer

    def get_queryset(self):
        """Filter verifications based on user role"""
        user = self.request.user

        # Allow unauthenticated for now (remove in production)
        if not user.is_authenticated:
            return Verification.objects.all()

        # Admins see everything
        if user.is_staff:
            return Verification.objects.all()

        # Get or create profile
        profile, created = UserProfile.objects.get_or_create(user=user)

        if profile.role == 'admin':
            return Verification.objects.all()
        else:
            # Users see only their own verifications
            return Verification.objects.filter(user=user)

    @action(detail=False, methods=['get'])
    def my_verifications(self, request):
        """Get current user's verifications"""
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Authentication required'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        verifications = Verification.objects.filter(user=request.user)
        serializer = VerificationSerializer(verifications, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def initiate(self, request):
        """
        Initiate a new verification process.
        This would integrate with external providers like Persona, Plaid, etc.
        """
        serializer = VerificationCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            verification = serializer.save()

            # Here you would integrate with external verification providers
            # For now, we'll set it to in_progress
            verification.status = 'in_progress'

            # Example: Generate verification URL (placeholder)
            # In production, this would call the provider's API
            provider = verification.provider
            verification_type = verification.verification_type

            # Placeholder URL generation
            if provider == 'plaid' and verification_type == 'bank_account':
                # In production: Call Plaid Link API
                verification.verification_url = f"https://plaid.com/verify/{verification.id}"
            elif provider == 'persona' and verification_type == 'identity':
                # In production: Call Persona API
                verification.verification_url = f"https://persona.com/verify/{verification.id}"
            elif provider == 'argyle' and verification_type == 'income':
                # In production: Call Argyle API
                verification.verification_url = f"https://argyle.com/verify/{verification.id}"

            verification.save()

            return Response(
                VerificationSerializer(verification).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Update verification status (admin only or webhook from provider)"""
        if not request.user.is_staff:
            # In production, verify webhook signature from provider
            return Response(
                {'error': 'Only admins can update verification status'},
                status=status.HTTP_403_FORBIDDEN
            )

        verification = self.get_object()
        serializer = VerificationUpdateSerializer(verification, data=request.data, partial=True)

        if serializer.is_valid():
            updated_verification = serializer.save()

            # If status changed to verified, set verified_at timestamp
            if updated_verification.status == 'verified' and not updated_verification.verified_at:
                from django.utils import timezone
                updated_verification.verified_at = timezone.now()
                updated_verification.save()

            return Response(VerificationSerializer(updated_verification).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def manual_review(self, request, pk=None):
        """Mark verification for manual review (admin only)"""
        if not request.user.is_staff:
            return Response(
                {'error': 'Only admins can request manual review'},
                status=status.HTTP_403_FORBIDDEN
            )

        verification = self.get_object()
        verification.status = 'manual_review'
        verification.reviewed_by = request.user
        verification.reviewer_notes = request.data.get('notes', '')
        verification.save()

        return Response(VerificationSerializer(verification).data)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Manually approve a verification (admin only)"""
        if not request.user.is_staff:
            return Response(
                {'error': 'Only admins can approve verifications'},
                status=status.HTTP_403_FORBIDDEN
            )

        verification = self.get_object()
        verification.status = 'verified'
        verification.reviewed_by = request.user
        verification.reviewer_notes = request.data.get('notes', '')

        from django.utils import timezone
        verification.verified_at = timezone.now()
        verification.save()

        return Response({
            'message': 'Verification approved',
            'verification': VerificationSerializer(verification).data
        })

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Manually reject a verification (admin only)"""
        if not request.user.is_staff:
            return Response(
                {'error': 'Only admins can reject verifications'},
                status=status.HTTP_403_FORBIDDEN
            )

        verification = self.get_object()
        verification.status = 'failed'
        verification.reviewed_by = request.user
        verification.failed_reason = request.data.get('reason', 'Verification failed manual review')
        verification.reviewer_notes = request.data.get('notes', '')
        verification.save()

        return Response({
            'message': 'Verification rejected',
            'verification': VerificationSerializer(verification).data
        })

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get verification statistics (admin only)"""
        if not request.user.is_staff:
            return Response(
                {'error': 'Only admins can view statistics'},
                status=status.HTTP_403_FORBIDDEN
            )

        queryset = Verification.objects.all()

        stats = {
            'total_verifications': queryset.count(),
            'by_status': {
                'pending': queryset.filter(status='pending').count(),
                'in_progress': queryset.filter(status='in_progress').count(),
                'verified': queryset.filter(status='verified').count(),
                'failed': queryset.filter(status='failed').count(),
                'manual_review': queryset.filter(status='manual_review').count(),
            },
            'by_type': {
                'identity': queryset.filter(verification_type='identity').count(),
                'income': queryset.filter(verification_type='income').count(),
                'bank_account': queryset.filter(verification_type='bank_account').count(),
                'sanctions': queryset.filter(verification_type='sanctions').count(),
                'fraud': queryset.filter(verification_type='fraud').count(),
            },
            'by_provider': list(queryset.values('provider').annotate(
                count=Count('id')
            )),
        }

        return Response(stats)

# ============= SUPPORT TICKET VIEWSET =============
class SupportTicketViewSet(viewsets.ModelViewSet):
    queryset = SupportTicket.objects.all()
    permission_classes = [AllowAny]  # Change to IsAuthenticated in production
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'category', 'priority']
    search_fields = ['ticket_number', 'subject', 'description']
    ordering_fields = ['created_at', 'priority', 'status']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return SupportTicketListSerializer
        elif self.action == 'create':
            return SupportTicketCreateSerializer
        elif self.action == 'add_message':
            return SupportTicketMessageCreateSerializer
        return SupportTicketDetailSerializer

    def get_queryset(self):
        """Filter tickets based on user role"""
        user = self.request.user

        # If user is not authenticated, return empty queryset for now
        if not user.is_authenticated:
            return SupportTicket.objects.all()  # Allow all for demo

        # Admin/staff can see all tickets
        if user.is_staff or user.is_superuser:
            return SupportTicket.objects.all()

        # Regular users can only see their own tickets
        return SupportTicket.objects.filter(user=user)

    @action(detail=False, methods=['get'])
    def my_tickets(self, request):
        """Get current user's support tickets"""
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Authentication required'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        tickets = SupportTicket.objects.filter(user=request.user)
        serializer = self.get_serializer(tickets, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def add_message(self, request, pk=None):
        """Add a message to a support ticket"""
        ticket = self.get_object()

        # Create message data with ticket ID
        message_data = request.data.copy()
        message_data['ticket'] = ticket.id

        serializer = SupportTicketMessageCreateSerializer(
            data=message_data,
            context={'request': request}
        )

        if serializer.is_valid():
            message = serializer.save()

            # Update ticket's updated_at timestamp
            ticket.save()

            return Response(
                SupportTicketMessageSerializer(message).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def close_ticket(self, request, pk=None):
        """Close a support ticket"""
        ticket = self.get_object()

        # Only staff or ticket owner can close
        if not (request.user.is_staff or ticket.user == request.user):
            return Response(
                {'error': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )

        from django.utils import timezone
        ticket.status = 'closed'
        ticket.resolved_at = timezone.now()
        ticket.save()

        return Response(
            SupportTicketDetailSerializer(ticket).data
        )

    @action(detail=True, methods=['post'])
    def reopen_ticket(self, request, pk=None):
        """Reopen a closed support ticket"""
        ticket = self.get_object()

        # Only ticket owner can reopen
        if not (request.user.is_staff or ticket.user == request.user):
            return Response(
                {'error': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )

        ticket.status = 'open'
        ticket.resolved_at = None
        ticket.save()

        return Response(
            SupportTicketDetailSerializer(ticket).data
        )

    @action(detail=False, methods=['get'], permission_classes=[IsAdminUser])
    def statistics(self, request):
        """Get support ticket statistics (admin only)"""
        queryset = self.get_queryset()

        stats = {
            'total': queryset.count(),
            'by_status': {
                'open': queryset.filter(status='open').count(),
                'in_progress': queryset.filter(status='in_progress').count(),
                'waiting_customer': queryset.filter(status='waiting_customer').count(),
                'resolved': queryset.filter(status='resolved').count(),
                'closed': queryset.filter(status='closed').count(),
            },
            'by_priority': {
                'low': queryset.filter(priority='low').count(),
                'medium': queryset.filter(priority='medium').count(),
                'high': queryset.filter(priority='high').count(),
                'urgent': queryset.filter(priority='urgent').count(),
            },
            'by_category': list(queryset.values('category').annotate(
                count=Count('id')
            )),
            'unassigned': queryset.filter(assigned_to__isnull=True).count(),
            'avg_resolution_time': 'Not implemented yet',  # TODO: Calculate
        }

        return Response(stats)
