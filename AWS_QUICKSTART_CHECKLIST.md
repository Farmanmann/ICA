# AWS Quick Start Checklist - Noor Financial

**Goal:** Get AWS KMS working with your loan portal in 30 minutes

---

## ⚡ Fast Track Setup

### **Pre-requisites:**
- [ ] Credit/debit card ready
- [ ] Email address for AWS account
- [ ] Phone for verification
- [ ] Password manager installed (recommended)

---

## 🚀 30-Minute Setup

### **Phase 1: AWS Account (5 min)**
- [ ] Go to [aws.amazon.com](https://aws.amazon.com) → Create account
- [ ] Enter email, password, account name
- [ ] Add payment info (only ~$1/month charged)
- [ ] Verify phone number
- [ ] Select "Basic Support - Free"
- [ ] Wait for confirmation email

### **Phase 2: Security Setup (5 min)**
- [ ] Login to AWS Console
- [ ] Enable MFA on root account (Account → Security Credentials)
  - Use Google Authenticator or Authy app
- [ ] Go to IAM Console
- [ ] Create account alias: `noor-financial`

### **Phase 3: Create Your Admin User (3 min)**
- [ ] IAM → Users → Create user
  - Name: `your-name-admin`
  - Console access: ✅
  - Custom password (save it!)
- [ ] Attach policy: `AdministratorAccess`
- [ ] Create access keys for CLI
  - **SAVE:** Access Key ID & Secret Access Key
- [ ] Enable MFA on this user too

### **Phase 4: Install AWS CLI (2 min)**
```bash
# macOS
brew install awscli

# Verify
aws --version
```

- [ ] Run `aws configure`
  - Access Key ID: (from Phase 3)
  - Secret Access Key: (from Phase 3)
  - Region: `us-east-1`
  - Format: `json`

- [ ] Test: `aws sts get-caller-identity`

### **Phase 5: Create App User + KMS Key (10 min)**

**5.1 Create Application User:**
```bash
# Create user
aws iam create-user --user-name noor-loan-app

# Create access keys (SAVE THE OUTPUT!)
aws iam create-access-key --user-name noor-loan-app
```

- [ ] **SAVE** Access Key ID and Secret Access Key

**5.2 Create KMS Policy:**
```bash
cat > ~/kms-policy.json << 'EOF'
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "kms:Decrypt",
                "kms:Encrypt",
                "kms:GenerateDataKey",
                "kms:DescribeKey"
            ],
            "Resource": "*"
        }
    ]
}
EOF

# Create policy
aws iam create-policy \
    --policy-name NoorLoanAppKMSPolicy \
    --policy-document file://~/kms-policy.json

# Get account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Attach policy
aws iam attach-user-policy \
    --user-name noor-loan-app \
    --policy-arn arn:aws:iam::${ACCOUNT_ID}:policy/NoorLoanAppKMSPolicy
```

**5.3 Create KMS Key:**
```bash
# Create key
aws kms create-key \
    --description "Noor Financial loan encryption key" \
    --key-usage ENCRYPT_DECRYPT \
    --origin AWS_KMS
```

- [ ] **SAVE** the KeyId from output

```bash
# Create alias (replace <KEY_ID> with actual ID)
aws kms create-alias \
    --alias-name alias/noor-loan-encryption \
    --target-key-id <KEY_ID>

# Enable auto-rotation
aws kms enable-key-rotation --key-id <KEY_ID>
```

### **Phase 6: Configure Django (5 min)**

**6.1 Update .env file:**
```bash
cd /Users/farmanman/ICA/loan-backend
nano .env  # or use your preferred editor
```

Add/update these lines:
```bash
ENCRYPTION_MODE=kms

AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=<APP_USER_ACCESS_KEY_FROM_5.1>
AWS_SECRET_ACCESS_KEY=<APP_USER_SECRET_FROM_5.1>
AWS_KMS_KEY_ID=alias/noor-loan-encryption
```

- [ ] Save and close

**6.2 Test it works:**
```bash
source /Users/farmanman/ICA/venv/bin/activate
python manage.py shell
```

```python
from loans.token_service import get_token_service

service = get_token_service()

# Test
token = service.tokenize("test-data-123", "test")
print(f"Token: {token}")

value = service.detokenize(token)
print(f"Value: {value}")

assert value == "test-data-123"
print("✅ SUCCESS! KMS is working!")
```

- [ ] Verify you see "✅ SUCCESS!"

---

## 🎉 You're Done!

**Total time:** ~30 minutes
**Monthly cost:** ~$1
**Security:** Enterprise-grade ✅

---

## 🔄 What Just Happened?

1. ✅ Created AWS account with MFA security
2. ✅ Created separate admin and app users (best practice)
3. ✅ Created KMS encryption key ($1/month)
4. ✅ Connected Django app to AWS KMS
5. ✅ Tested tokenization works

---

## 📝 What You Have Now

**In AWS:**
- Root account (secure, MFA enabled)
- Admin user (for you to manage AWS)
- App user (for Django to use KMS)
- KMS key (encrypts your loan data)

**In Django:**
- Token service using AWS KMS
- Clean tokens (tok_xxx) instead of encrypted gibberish
- Full audit trail of all token access
- Production-ready encryption

---

## 🔜 Next Steps

**Immediate:**
- [ ] Set up billing alert (see full guide)
- [ ] Save all credentials in password manager
- [ ] Test creating a loan with tokenized data

**This Week:**
- [ ] Update loan views to use tokenization
- [ ] Test in Django admin
- [ ] Review audit logs

**Before Production:**
- [ ] Decide on database (SQLite vs RDS)
- [ ] Set up CloudWatch monitoring
- [ ] Document disaster recovery

---

## 💰 Cost Breakdown

| Item | Cost |
|------|------|
| KMS Key | $1.00/month |
| KMS API calls (100 loans) | $0.0003/month |
| **Total** | **~$1.00/month** |

**Compare to:**
- VGS: $299-499/month
- Skyflow: $500-800/month
- **You save:** $298-799/month! 💰

---

## 🆘 Troubleshooting

**Can't create AWS account:**
- Check email/phone aren't already used
- Try incognito mode
- Contact AWS support chat

**AWS CLI not working:**
```bash
# Reconfigure
aws configure
```

**Django can't connect to KMS:**
- Check .env file has correct credentials
- Verify ENCRYPTION_MODE=kms
- Check AWS region matches
- View error in Django: `python manage.py shell`

**Need help:**
- Read full guide: `AWS_SETUP_GUIDE.md`
- Read KMS guide: `AWS_KMS_IMPLEMENTATION_GUIDE.md`

---

## 📚 Documentation Files

1. **This file:** Quick start checklist
2. **AWS_SETUP_GUIDE.md:** Detailed setup with troubleshooting
3. **AWS_KMS_IMPLEMENTATION_GUIDE.md:** How to use KMS in your app
4. **DESIGN_SYSTEM.md:** Frontend design system (bonus!)

---

**Ready to go? Follow the checkboxes above!** ✅

Good luck! 🚀
