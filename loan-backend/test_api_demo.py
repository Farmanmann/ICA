#!/usr/bin/env python
"""
Quick API Demo Script
Run this to demonstrate the complete end-to-end flow via API calls
"""

import requests
import json

BASE_URL = "http://localhost:8000/api"

def print_section(title):
    print(f"\n{'='*70}")
    print(f"  {title}")
    print(f"{'='*70}\n")

def print_response(response):
    print(f"Status: {response.status_code}")
    try:
        print(json.dumps(response.json(), indent=2))
    except:
        print(response.text)
    print()

# Start demo
print_section("🎬 ISLAMIC LOAN MARKETPLACE - API DEMO")

# 1. Register User
print_section("1️⃣ User Registration")
register_data = {
    "username": "demo_borrower",
    "email": "demo@example.com",
    "password": "DemoPass123!",
    "password2": "DemoPass123!",
    "first_name": "Demo",
    "last_name": "Borrower",
    "role": "borrower",
    "phone": "555-DEMO-001"
}
response = requests.post(f"{BASE_URL}/auth/register/", json=register_data)
print_response(response)

# 2. Login
print_section("2️⃣ User Login (Get JWT Token)")
login_data = {
    "username": "demo_borrower",
    "password": "DemoPass123!"
}
response = requests.post(f"{BASE_URL}/auth/login/", json=login_data)
tokens = response.json() if response.status_code == 200 else {}
access_token = tokens.get('access', '')
print_response(response)

# Set auth header
headers = {"Authorization": f"Bearer {access_token}"}

# 3. Apply for Loan
print_section("3️⃣ Apply for Loan (with AWS KMS Tokenization)")
loan_data = {
    "borrower_name": "Demo Borrower",
    "email": "demo@example.com",
    "phone": "555-123-4567",
    "address": "123 Demo Street, Demo City, DS 12345",
    "ssn": "123-45-6789",
    "loan_type": "murabaha",
    "amount": "250000.00",
    "term": 360,
    "purpose": "property",
    "property_address": "456 Property Lane, Demo City, DS",
    "property_value": "300000.00",
    "annual_income": "75000.00",
    "credit_score": 720,
    "employment_status": "employed"
}
response = requests.post(f"{BASE_URL}/loans/", json=loan_data, headers=headers)
loan_id = response.json().get('id') if response.status_code == 201 else None
print_response(response)

# 4. Get Loan Details (with Detokenization)
if loan_id:
    print_section(f"4️⃣ Retrieve Loan Details (ID: {loan_id})")
    response = requests.get(f"{BASE_URL}/loans/{loan_id}/", headers=headers)
    print_response(response)

# 5. Get My Loans
print_section("5️⃣ Get My Loans")
response = requests.get(f"{BASE_URL}/loans/my_loans/", headers=headers)
print_response(response)

# 6. Create Support Ticket
print_section("6️⃣ Create Support Ticket")
ticket_data = {
    "subject": "Question about my loan application",
    "category": "loan_application",
    "description": "When can I expect to hear back about my application?",
    "priority": "medium"
}
response = requests.post(f"{BASE_URL}/support-tickets/", json=ticket_data, headers=headers)
ticket_id = response.json().get('id') if response.status_code == 201 else None
print_response(response)

# 7. Add Message to Ticket
if ticket_id:
    print_section(f"7️⃣ Add Message to Ticket (ID: {ticket_id})")
    message_data = {
        "message": "Also, this is for a property purchase in Springfield."
    }
    response = requests.post(
        f"{BASE_URL}/support-tickets/{ticket_id}/add_message/",
        json=message_data,
        headers=headers
    )
    print_response(response)

# 8. Get Dashboard Stats
print_section("8️⃣ Dashboard Statistics")
response = requests.get(f"{BASE_URL}/dashboard/stats/")
print_response(response)

# 9. Calculate Loan
print_section("9️⃣ Loan Calculator")
calc_data = {
    "amount": "250000.00",
    "term": 360
}
response = requests.post(f"{BASE_URL}/calculator/", json=calc_data)
print_response(response)

print_section("✅ DEMO COMPLETE!")
print("Check Django admin panel to see:")
print("  - Loans with tokenized fields")
print("  - TokenVault with encrypted data")
print("  - AuditLog with all actions")
print("  - Support tickets")
print("\nAdmin URL: http://localhost:8000/admin")
