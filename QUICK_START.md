# Quick Start Guide - Supabase Authentication

Get your Noor Financial portal authentication up and running in 10 minutes.

## Step 1: Create Supabase Project (2 minutes)

1. Go to https://app.supabase.com and sign up/log in
2. Click "New Project"
3. Enter:
   - Name: `noor-financial-portal`
   - Database Password: (generate and save it)
   - Region: `US East (North Virginia)` or closest to you
4. Click "Create new project" and wait ~2 minutes

## Step 2: Get API Keys (1 minute)

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy:
   - Project URL
   - anon public key
3. Update your `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Step 3: Run Database Migration (2 minutes)

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy contents of `supabase/migrations/001_create_profiles_table.sql`
4. Paste and click "Run"
5. Verify: Go to **Table Editor** → should see `profiles` table

## Step 4: Configure Auth Settings (3 minutes)

### Enable Email Confirmation
1. Go to **Authentication** → **Providers** → **Email**
2. Enable "Confirm email"
3. Save

### Set URLs
1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL**: `http://localhost:3000`
3. Add **Redirect URLs** (one per line):
```
http://localhost:3000/**
http://localhost:3000/auth/callback
http://localhost:3000/auth/confirmed
http://localhost:3000/auth/update-password
```
4. Save

## Step 5: Test It! (2 minutes)

```bash
# Start your dev server
cd loan-portal
npm run dev
```

1. Go to http://localhost:3000/auth/signup-borrower
2. Create an account
3. Check your email for verification link
4. Click the link
5. You should see the "Email Confirmed!" page
6. Log in at http://localhost:3000/auth/login

## That's It! 🎉

Your authentication is now set up and working!

## Next Steps

- ✅ **Test all flows**: Try lender signup, password reset, etc.
- ✅ **Customize email templates**: Go to **Authentication** → **Email Templates**
- ✅ **Set up rate limiting**: Go to **Authentication** → **Rate Limits**
- ✅ **Read full setup guide**: See `SUPABASE_SETUP_GUIDE.md`

## Troubleshooting

**Not receiving emails?**
- Check spam folder
- Verify email confirmation is enabled
- Check Supabase logs: **Authentication** → **Logs**

**Can't log in after signup?**
- Make sure you clicked the verification link in email
- Check email is confirmed: **Authentication** → **Users** → check your user

**Page not loading?**
- Verify `.env.local` has correct values
- Restart dev server: `npm run dev`
- Check browser console for errors

## Support

Need help? Check:
- `SUPABASE_SETUP_GUIDE.md` - Detailed setup instructions
- `SUPABASE_IMPLEMENTATION_SUMMARY.md` - Technical details
- https://supabase.com/docs - Supabase documentation
