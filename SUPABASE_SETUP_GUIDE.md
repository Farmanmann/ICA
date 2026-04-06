# Supabase Setup Guide for Noor Financial

This guide will walk you through setting up Supabase authentication for the Noor Financial loan portal.

## Prerequisites

- A Supabase account (create one at https://supabase.com)
- Access to the Noor Financial codebase
- Node.js and npm installed

## Step 1: Create a Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in the project details:
   - **Name**: Noor Financial Loan Portal
   - **Database Password**: Generate a strong password and save it securely
   - **Region**: Choose the region closest to your users (e.g., US East for Texas)
4. Click "Create new project"
5. Wait for the project to be provisioned (2-3 minutes)

## Step 2: Get Your API Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")
3. Update your `.env.local` file with these values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Step 3: Set Up the Database

### Run the SQL Migration

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the contents of `supabase/migrations/001_create_profiles_table.sql`
4. Click "Run" to execute the migration

This will:
- Create the `profiles` table with `id`, `role`, `created_at`, and `updated_at` columns
- Set up Row Level Security (RLS) policies
- Create a trigger to automatically create a profile when a user signs up
- Create an `updated_at` trigger for automatic timestamps

### Verify the Migration

1. Go to **Table Editor** in your Supabase dashboard
2. You should see a `profiles` table
3. Click on the table to view its structure and policies

## Step 4: Configure Authentication Settings

### Email Confirmation

1. Go to **Authentication** → **Providers** → **Email**
2. Enable "Confirm email"
3. Set **Confirm email** to enabled
4. Save the settings

### Site URL Configuration

1. Go to **Authentication** → **URL Configuration**
2. Set the **Site URL**:
   - For local development: `http://localhost:3000`
   - For production: `https://your-production-domain.com`

### Redirect URLs

Add the following redirect URLs (one per line):

**For Local Development:**
```
http://localhost:3000/**
http://localhost:3000/auth/callback
http://localhost:3000/auth/confirmed
http://localhost:3000/auth/update-password
```

**For Production** (replace with your actual domain):
```
https://your-domain.com/**
https://your-domain.com/auth/callback
https://your-domain.com/auth/confirmed
https://your-domain.com/auth/update-password
```

### Email Templates

Go to **Authentication** → **Email Templates** and customize the following templates:

#### Confirm Signup Template

**Subject:** `Confirm your email for Noor Financial`

**Message Body:**
```html
<h2>Confirm your email</h2>
<p>Thank you for signing up with Noor Financial!</p>
<p>Please click the link below to confirm your email address and activate your account:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>
<p>If you did not sign up for a Noor Financial account, please ignore this email.</p>
<p>This link will expire in 24 hours.</p>
<br>
<p>Best regards,<br>Noor Financial Team</p>
```

#### Password Reset Template

**Subject:** `Reset your password for Noor Financial`

**Message Body:**
```html
<h2>Reset your password</h2>
<p>We received a request to reset your password for your Noor Financial account.</p>
<p>Click the link below to create a new password:</p>
<p><a href="{{ .ConfirmationURL }}">Reset your password</a></p>
<p>If you did not request a password reset, please ignore this email or contact our support team if you have concerns.</p>
<p>This link will expire in 24 hours.</p>
<br>  
<p>Best regards,<br>Noor Financial Team</p>
```

## Step 5: Security and Rate Limiting

### Rate Limiting Configuration

1. Go to **Authentication** → **Rate Limits**
2. Configure the following limits to prevent abuse:

**Recommended Settings:**
- **Email signups**: 10 per hour per IP
- **Password recovery**: 5 per hour per IP
- **Email/OTP sending**: 20 per hour per IP
- **Token refresh**: 100 per hour per user

### Additional Security Settings

1. **Password Requirements**:
   - Go to **Authentication** → **Policies**
   - Minimum password length: 8 characters (already enforced in code)

2. **Session Settings**:
   - Go to **Authentication** → **Sessions**
   - JWT expiry: 3600 seconds (1 hour) recommended
   - Refresh token lifetime: 2592000 seconds (30 days)

3. **Bot Protection** (Optional but recommended):
   - Go to **Authentication** → **Settings**
   - Enable **reCAPTCHA** for signup and password reset forms
   - Get reCAPTCHA keys from https://www.google.com/recaptcha
   - Add keys to your Supabase settings

## Step 6: Production Checklist

Before going to production, ensure:

### Environment Variables
- [ ] Update `NEXT_PUBLIC_SITE_URL` to your production domain
- [ ] Update redirect URLs in Supabase dashboard
- [ ] Verify all environment variables are set in your hosting platform

### Email Configuration
- [ ] Set up a custom SMTP server (optional but recommended for better deliverability)
- [ ] Go to **Project Settings** → **Auth** → **SMTP Settings**
- [ ] Configure with your email service (SendGrid, Amazon SES, etc.)

### Database
- [ ] Run database migrations in production Supabase project
- [ ] Verify RLS policies are active
- [ ] Test profile creation on signup

### Security
- [ ] Enable rate limiting
- [ ] Consider enabling reCAPTCHA
- [ ] Review and test all RLS policies
- [ ] Set up database backups (automatic in Supabase)

### Testing
- [ ] Test borrower signup flow
- [ ] Test lender signup flow
- [ ] Test email verification
- [ ] Test login
- [ ] Test password reset
- [ ] Test role-based access control

## Step 7: Testing the Setup

### Test User Signup

1. Start your development server: `npm run dev`
2. Go to http://localhost:3000/auth/signup-borrower
3. Fill in the form and submit
4. Check your email for the verification link
5. Click the verification link
6. Verify you're redirected to the confirmed page
7. Try logging in

### Test Password Reset

1. Go to http://localhost:3000/auth/forgot-password
2. Enter your email
3. Check your email for the reset link
4. Click the reset link
5. Enter a new password
6. Verify you can log in with the new password

### Test Role-Based Access

1. Log in as a borrower
2. Try accessing `/lender/dashboard` - should redirect to `/borrower/dashboard`
3. Log out and create a lender account
4. Verify lender can access `/lender/dashboard` but not `/borrower/dashboard`

## Troubleshooting

### Email Verification Not Working

- Check that "Confirm email" is enabled in Authentication settings
- Verify redirect URLs include `/auth/callback`
- Check spam folder for verification emails
- Review email template configuration

### Users Can't Log In

- Verify email has been confirmed
- Check that the user exists in **Authentication** → **Users**
- Verify profile was created in the `profiles` table
- Check browser console for error messages

### Redirect Loops

- Verify Site URL is correctly set
- Check that redirect URLs don't have trailing slashes where they shouldn't
- Clear browser cookies and try again

### Profile Not Created

- Check the `handle_new_user` trigger is active in the database
- Go to **Database** → **Functions** and verify `handle_new_user` exists
- Check the **Table Editor** → **Triggers** for `on_auth_user_created`

## Support

For more help:
- Supabase Documentation: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- Next.js + Supabase Guide: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs

## Additional Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Integration](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)
