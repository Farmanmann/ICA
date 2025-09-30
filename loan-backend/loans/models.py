from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import User

class Loan(models.Model):
    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Approved", "Approved"),
        ("Rejected", "Rejected"),
        ("Closed", "Closed"),
    ]

    borrower = models.ForeignKey(
    User,
    on_delete=models.CASCADE,
    related_name="loans",
    null=True,
    blank=True
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    term = models.CharField(max_length=50)  # e.g., "6 months"
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Pending")
    due_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"Loan {self.id} - {self.borrower.username}"


class Repayment(models.Model):
    loan = models.ForeignKey(Loan, on_delete=models.CASCADE, related_name="repayments")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateField()
    status = models.CharField(max_length=20, default="Pending")

    def __str__(self):
        return f"Repayment {self.id} for Loan {self.loan.id}"

