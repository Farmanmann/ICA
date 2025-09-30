from django.shortcuts import render

from rest_framework import viewsets
from .models import Loan, Repayment
from .serializers import LoanSerializer, RepaymentSerializer

class LoanViewSet(viewsets.ModelViewSet):
    queryset = Loan.objects.all()
    serializer_class = LoanSerializer

class RepaymentViewSet(viewsets.ModelViewSet):
    queryset = Repayment.objects.all()
    serializer_class = RepaymentSerializer

# Create your views here.
