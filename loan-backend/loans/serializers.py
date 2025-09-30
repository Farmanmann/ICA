from rest_framework import serializers
from .models import Loan, Repayment

class RepaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Repayment
        fields = "__all__"

class LoanSerializer(serializers.ModelSerializer):
    borrower_name = serializers.CharField(
        source="borrower.username", read_only=True, default="Unassigned"
    )

    class Meta:
        model = Loan
        fields = ["id", "amount", "term", "status", "due_date", "borrower", "borrower_name", "repayments"]

