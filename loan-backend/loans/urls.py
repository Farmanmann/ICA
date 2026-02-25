from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

router = DefaultRouter()
router.register(r'loans', views.LoanViewSet, basename='loan')
router.register(r'repayments', views.RepaymentViewSet, basename='repayment')
router.register(r'verifications', views.VerificationViewSet, basename='verification')
router.register(r'support-tickets', views.SupportTicketViewSet, basename='support-ticket')

urlpatterns = [
    # Router URLs
    path('', include(router.urls)),

    # Authentication
    path('auth/register/', views.register_user, name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/user/', views.current_user, name='current-user'),
    path('auth/profile/', views.update_profile, name='update-profile'),

    # Email Verification
    path('auth/verify-email/', views.verify_email, name='verify-email'),
    path('auth/resend-verification/', views.resend_verification_email, name='resend-verification'),

    # Password Reset
    path('auth/request-password-reset/', views.request_password_reset, name='request-password-reset'),
    path('auth/confirm-password-reset/', views.confirm_password_reset, name='confirm-password-reset'),

    # Dashboard & Utilities
    path('dashboard/stats/', views.dashboard_stats, name='dashboard-stats'),
    path('calculator/', views.calculate_loan, name='calculate-loan'),
    path('loan-options/', views.loan_options, name='loan-options'),
]