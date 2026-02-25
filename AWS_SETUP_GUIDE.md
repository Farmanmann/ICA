# AWS Complete Setup Guide - Noor Financial Loan Portal

**Created:** February 2026
**Purpose:** Set up AWS account, KMS, and optional RDS database for production

---

## 📋 Overview

This guide will help you set up:
1. ✅ AWS Account (Free Tier eligible)
2. ✅ IAM User with security best practices
3. ✅ AWS KMS for encryption
4. ✅ (Optional) RDS for production database
5. ✅ Billing alerts to avoid surprises

**Estimated Setup Time:** 30-45 minutes
**Monthly Cost:** $1-5 (depending on what you enable)

---

## 🎯 STEP 1: Create AWS Account

### **1.1 Sign Up**

1. Go to [https://aws.amazon.com](https://aws.amazon.com)
2. Click **"Create an AWS Account"**
3. Provide:
   - **Email address** (use a dedicated email like `aws@noorfinancial.com`)
   - **AWS account name:** "Noor Financial Production"
   - **Password:** Use a strong password (save in password manager)

4. **Contact Information:**
   - Account type: **Business** (even for MVP)
   - Company name: "Noor Financial"
   - Phone number (for verification)
   - Address

5. **Payment Information:**
   - Add credit/debit card (required, but won't be charged much)
   - AWS will charge $1 to verify (refunded immediately)

6. **Identity Verification:**
   - Phone verification via SMS or call
   - Enter the code received

7. **Select Support Plan:**
   - Choose **"Basic Support - Free"**
   - (You can upgrade later if needed)

8. **Complete Sign-Up:**
   - Wait for confirmation email (usually instant)
   - Click "Go to AWS Console"

✅ **You now have an AWS account!**

---

## 🔐 STEP 2: Secure Your Root Account (CRITICAL!)

**⚠️ NEVER use root account for daily operations!**

### **2.1 Enable MFA (Multi-Factor Authentication)**

1. In AWS Console, click your account name (top right) → **"Security Credentials"**
2. Find **"Multi-factor authentication (MFA)"** section
3. Click **"Activate MFA"**
4. Choose MFA device:
   - **Recommended:** Virtual MFA device (Google Authenticator, Authy, 1Password)
   - Scan QR code with your authenticator app
   - Enter two consecutive MFA codes
   - Click **"Assign MFA"**

✅ **Root account is now protected with MFA**

### **2.2 Create Account Alias**

1. In IAM Console, click **"Dashboard"**
2. Under **"AWS Account"**, click **"Create"** next to account alias
3. Enter: `noor-financial` (or your preferred alias)
4. Your sign-in URL is now: `https://noor-financial.signin.aws.amazon.com/console`

---

## 👤 STEP 3: Create IAM Admin User (YOU will use this)

**Why:** Never use root account. Create an admin user for yourself.

### **3.1 Create Your Admin User**

1. Go to **IAM Console:** [https://console.aws.amazon.com/iam](https://console.aws.amazon.com/iam)
2. Click **"Users"** → **"Create user"**
3. User details:
   - **User name:** `your-name-admin` (e.g., `farman-admin`)
   - ✅ Check **"Provide user access to AWS Management Console"**
   - Console password: **Custom password** (save it!)
   - ❌ Uncheck **"Users must create a new password at next sign-in"**
4. Click **"Next"**

5. **Permissions:**
   - Select **"Attach policies directly"**
   - Search and select: **`AdministratorAccess`**
   - Click **"Next"**

6. **Review and create**
   - Click **"Create user"**
   - ⚠️ **SAVE the console password!**

### **3.2 Enable MFA for Admin User**

1. Click on the user you just created
2. Go to **"Security credentials"** tab
3. Under **"Multi-factor authentication"**, click **"Assign MFA device"**
4. Follow same steps as root account MFA

### **3.3 Create Access Keys for CLI**

1. Still in user details, **"Security credentials"** tab
2. Scroll to **"Access keys"**
3. Click **"Create access key"**
4. Select use case: **"Command Line Interface (CLI)"**
5. Check **"I understand..."**, click **"Next"**
6. Description: "Local development CLI access"
7. Click **"Create access key"**
8. ⚠️ **SAVE THESE CREDENTIALS:**
   ```
   Access Key ID: AKIA... (example: AKIAIOSFODNN7EXAMPLE)
   Secret Access Key: wJalr... (example: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY)
   ```
9. Download .csv file and store securely
10. Click **"Done"**

✅ **You now have a secure admin user with CLI access!**

---

## 🖥️ STEP 4: Install & Configure AWS CLI

### **4.1 Install AWS CLI**

**macOS:**
```bash
brew install awscli
```

**Linux:**
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

**Verify installation:**
```bash
aws --version
# Should show: aws-cli/2.x.x
```

### **4.2 Configure AWS CLI**

```bash
aws configure
```

**Enter when prompted:**
```
AWS Access Key ID: <YOUR_ACCESS_KEY_ID_FROM_STEP_3.3>
AWS Secret Access Key: <YOUR_SECRET_ACCESS_KEY_FROM_STEP_3.3>
Default region name: us-east-1
Default output format: json
```

**Test it works:**
```bash
aws sts get-caller-identity
```

**Should show:**
```json
{
    "UserId": "AIDAI...",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/your-name-admin"
}
```

✅ **AWS CLI is configured!**

---

## 🔑 STEP 5: Create Application IAM User (for your Django app)

**Why:** Your Django app needs its own user with limited permissions (principle of least privilege).

### **5.1 Create Application User**

```bash
# Create user for the loan application
aws iam create-user --user-name noor-loan-app

# Create access keys
aws iam create-access-key --user-name noor-loan-app
```

**Save the output:**
```json
{
    "AccessKey": {
        "UserName": "noor-loan-app",
        "AccessKeyId": "AKIAIOSFODNN7EXAMPLE",
        "SecretAccessKey": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
        ...
    }
}
```

⚠️ **SAVE THESE - you'll use them in .env file!**

### **5.2 Create Custom IAM Policy (Least Privilege)**

Create a file `kms-policy.json`:
```bash
cat > ~/kms-policy.json << 'EOF'
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "KMSEncryptDecrypt",
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
```

**Create and attach the policy:**
```bash
# Create policy
aws iam create-policy \
    --policy-name NoorLoanAppKMSPolicy \
    --policy-document file://~/kms-policy.json

# Get your AWS account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Attach policy to user
aws iam attach-user-policy \
    --user-name noor-loan-app \
    --policy-arn arn:aws:iam::${ACCOUNT_ID}:policy/NoorLoanAppKMSPolicy
```

✅ **Application user created with minimum required permissions!**

---

## 🔐 STEP 6: Create KMS Encryption Key

### **6.1 Create KMS Key**

```bash
# Create the KMS key
aws kms create-key \
    --description "Noor Financial loan data encryption master key" \
    --key-usage ENCRYPT_DECRYPT \
    --origin AWS_KMS \
    --tags TagKey=Project,TagValue=NoorFinancial TagKey=Environment,TagValue=Production
```

**Save the KeyId from output:**
```json
{
    "KeyMetadata": {
        "KeyId": "1234abcd-12ab-34cd-56ef-1234567890ab",  ← SAVE THIS
        ...
    }
}
```

### **6.2 Create Key Alias**

```bash
# Replace <KEY_ID> with the KeyId from above
aws kms create-alias \
    --alias-name alias/noor-loan-encryption \
    --target-key-id <KEY_ID>
```

**Example:**
```bash
aws kms create-alias \
    --alias-name alias/noor-loan-encryption \
    --target-key-id 1234abcd-12ab-34cd-56ef-1234567890ab
```

### **6.3 Enable Automatic Key Rotation (Recommended)**

```bash
aws kms enable-key-rotation --key-id <KEY_ID>
```

### **6.4 Verify KMS Key**

```bash
# List your keys
aws kms list-keys

# Describe your key
aws kms describe-key --key-id alias/noor-loan-encryption
```

✅ **KMS key created and ready to use!**

**💰 Cost:** $1.00/month per key

---

## 📝 STEP 7: Configure Your Django Application

### **7.1 Update .env File**

Edit `/Users/farmanman/ICA/loan-backend/.env`:

```bash
# Encryption Configuration
ENCRYPTION_MODE=kms

# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=<ACCESS_KEY_FROM_STEP_5.1>
AWS_SECRET_ACCESS_KEY=<SECRET_KEY_FROM_STEP_5.1>
AWS_KMS_KEY_ID=alias/noor-loan-encryption
```

### **7.2 Test KMS Integration**

```bash
cd /Users/farmanman/ICA/loan-backend
source /Users/farmanman/ICA/venv/bin/activate

# Test in Django shell
python manage.py shell
```

**In Python shell:**
```python
from loans.token_service import get_token_service

service = get_token_service()

# Test tokenization
token = service.tokenize("123-45-6789", "ssn")
print(f"✅ Token created: {token}")

# Test detokenization
value = service.detokenize(token)
print(f"✅ Value retrieved: {value}")

# Check it matches
assert value == "123-45-6789"
print("✅ AWS KMS is working perfectly!")
```

**Expected output:**
```
✅ Token created: tok_Gx7mK2nP9sR4vW8z
✅ Value retrieved: 123-45-6789
✅ AWS KMS is working perfectly!
```

---

## 💾 STEP 8: (Optional) Set Up RDS Database

**Current:** You're using SQLite locally (fine for development)
**Production:** You'll need a real database (PostgreSQL or MySQL)

### **Option A: Keep SQLite (Recommended for MVP)**

✅ **Free**
✅ **Simple**
✅ **Works locally**
❌ **Not for production with multiple servers**

**Action:** Nothing needed! Continue using SQLite.

---

### **Option B: Set Up RDS PostgreSQL (Recommended for Production)**

**Cost:** $15-30/month (db.t3.micro free tier for 12 months)

#### **8.1 Create RDS Instance**

```bash
# Create PostgreSQL database
aws rds create-db-instance \
    --db-instance-identifier noor-financial-db \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --engine-version 15.4 \
    --master-username nooradmin \
    --master-user-password <CHOOSE_STRONG_PASSWORD> \
    --allocated-storage 20 \
    --storage-type gp2 \
    --backup-retention-period 7 \
    --preferred-backup-window "03:00-04:00" \
    --preferred-maintenance-window "sun:04:00-sun:05:00" \
    --publicly-accessible \
    --tags Key=Project,Value=NoorFinancial Key=Environment,Value=Production
```

⚠️ **Replace `<CHOOSE_STRONG_PASSWORD>` with a strong password (save it!)**

#### **8.2 Wait for Database to Be Available**

```bash
# Check status (takes 5-10 minutes)
aws rds describe-db-instances \
    --db-instance-identifier noor-financial-db \
    --query 'DBInstances[0].DBInstanceStatus' \
    --output text
```

**Wait until it shows:** `available`

#### **8.3 Get Database Endpoint**

```bash
aws rds describe-db-instances \
    --db-instance-identifier noor-financial-db \
    --query 'DBInstances[0].Endpoint.Address' \
    --output text
```

**Save the endpoint** (looks like: `noor-financial-db.xxxxxxxxx.us-east-1.rds.amazonaws.com`)

#### **8.4 Configure Security Group**

```bash
# Get the security group ID
SG_ID=$(aws rds describe-db-instances \
    --db-instance-identifier noor-financial-db \
    --query 'DBInstances[0].VpcSecurityGroups[0].VpcSecurityGroupId' \
    --output text)

# Allow your local IP to connect (get your IP from https://ipinfo.io/ip)
aws ec2 authorize-security-group-ingress \
    --group-id $SG_ID \
    --protocol tcp \
    --port 5432 \
    --cidr <YOUR_IP>/32
```

**Replace `<YOUR_IP>` with your actual IP address**

#### **8.5 Update Django Settings**

Install PostgreSQL adapter:
```bash
pip install psycopg2-binary
```

Update `loan-backend/backend/settings.py`:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'postgres',
        'USER': 'nooradmin',
        'PASSWORD': '<YOUR_RDS_PASSWORD>',
        'HOST': '<YOUR_RDS_ENDPOINT>',
        'PORT': '5432',
    }
}
```

**Run migrations:**
```bash
python manage.py migrate
python manage.py createsuperuser
```

✅ **RDS PostgreSQL is ready!**

---

## 💰 STEP 9: Set Up Billing Alerts (IMPORTANT!)

### **9.1 Enable Billing Alerts**

1. Go to [Billing Preferences](https://console.aws.amazon.com/billing/home#/preferences)
2. Check ✅ **"Receive Billing Alerts"**
3. Click **"Save preferences"**

### **9.2 Create Billing Alarm**

```bash
# Create SNS topic for alerts
aws sns create-topic --name billing-alerts --region us-east-1

# Subscribe your email
aws sns subscribe \
    --topic-arn arn:aws:sns:us-east-1:<ACCOUNT_ID>:billing-alerts \
    --protocol email \
    --notification-endpoint <YOUR_EMAIL> \
    --region us-east-1
```

⚠️ **Check your email and confirm the subscription!**

**Create CloudWatch alarm:**
```bash
aws cloudwatch put-metric-alarm \
    --alarm-name billing-alert-10-dollars \
    --alarm-description "Alert when AWS charges exceed $10" \
    --metric-name EstimatedCharges \
    --namespace AWS/Billing \
    --statistic Maximum \
    --period 21600 \
    --evaluation-periods 1 \
    --threshold 10 \
    --comparison-operator GreaterThanThreshold \
    --alarm-actions arn:aws:sns:us-east-1:<ACCOUNT_ID>:billing-alerts \
    --dimensions Name=Currency,Value=USD \
    --region us-east-1
```

✅ **You'll be alerted if costs exceed $10!**

---

## ✅ FINAL CHECKLIST

Mark each item as you complete it:

**AWS Account:**
- [ ] AWS account created
- [ ] Root account MFA enabled
- [ ] Account alias created (`noor-financial`)

**IAM Users:**
- [ ] Admin user created (for you)
- [ ] Admin user MFA enabled
- [ ] Admin user access keys created
- [ ] Application user created (`noor-loan-app`)
- [ ] Application user has KMS policy attached

**AWS CLI:**
- [ ] AWS CLI installed
- [ ] AWS CLI configured with admin credentials
- [ ] `aws sts get-caller-identity` works

**KMS:**
- [ ] KMS key created
- [ ] Key alias created (`alias/noor-loan-encryption`)
- [ ] Key rotation enabled
- [ ] KMS key ID saved securely

**Django Integration:**
- [ ] `.env` file updated with AWS credentials
- [ ] `ENCRYPTION_MODE=kms` in `.env`
- [ ] Token service tested successfully
- [ ] Tokens appear in database

**Database (Optional):**
- [ ] RDS PostgreSQL created (if using)
- [ ] Security group configured
- [ ] Django connected to RDS
- [ ] Migrations run successfully

**Billing:**
- [ ] Billing alerts enabled
- [ ] Email subscription confirmed
- [ ] CloudWatch alarm created

---

## 📊 Expected Monthly Costs

### **MVP Setup (What you have now):**
- KMS key: $1.00/month
- KMS API calls (100 loans): $0.0003/month
- RDS (if not using): $0
- **Total: ~$1.00/month**

### **With RDS PostgreSQL:**
- KMS: $1.00/month
- RDS db.t3.micro: $15-20/month (FREE for 12 months!)
- RDS storage (20GB): $2.30/month
- **Total: ~$18-23/month (or $1 with free tier)**

### **Free Tier Benefits (First 12 months):**
- ✅ RDS: 750 hours/month of db.t3.micro (covers 1 instance 24/7)
- ✅ RDS storage: 20GB
- ❌ KMS: No free tier ($1/month per key)

---

## 🚀 Next Steps

**Immediate (Today):**
1. Complete all checklist items above
2. Test KMS integration in Django shell
3. Create a test loan to verify encryption works

**This Week:**
1. Update loan application views to use tokenization
2. Test token revocation
3. Review audit logs in Django admin

**Before Production:**
1. Decide: SQLite or RDS?
2. If RDS: Complete Step 8
3. Set up automated database backups
4. Document disaster recovery process

---

## 🆘 Troubleshooting

### **Issue: AWS CLI not configured**
```bash
aws configure list
# If empty, run: aws configure
```

### **Issue: KMS permission denied**
```bash
# Check your user has KMS policy attached
aws iam list-attached-user-policies --user-name noor-loan-app
```

### **Issue: Django can't connect to KMS**
```python
# In Django shell
import boto3
client = boto3.client('kms', region_name='us-east-1')
print(client.list_keys())
# Should show your keys
```

### **Issue: Token service fails**
- Check `.env` has correct AWS credentials
- Verify `ENCRYPTION_MODE=kms`
- Check AWS region matches KMS key region
- View Django logs for detailed error

---

## 📞 Resources

- **AWS Free Tier:** https://aws.amazon.com/free/
- **KMS Pricing:** https://aws.amazon.com/kms/pricing/
- **RDS Pricing:** https://aws.amazon.com/rds/pricing/
- **IAM Best Practices:** https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html
- **Your KMS Implementation Guide:** `/Users/farmanman/ICA/AWS_KMS_IMPLEMENTATION_GUIDE.md`

---

## 🎉 Congratulations!

You now have:
- ✅ Secure AWS account with MFA
- ✅ Properly configured IAM users
- ✅ AWS KMS for encryption
- ✅ Production-ready tokenization
- ✅ Billing alerts for cost control
- ✅ (Optional) RDS database

**Your Noor Financial loan portal is ready for secure production deployment!** 🚀

**Total setup time:** 30-45 minutes
**Monthly cost:** $1-23 (depending on database choice)
**Security:** Enterprise-grade encryption ✅
**Compliance:** SOC 2, PCI DSS ready ✅
