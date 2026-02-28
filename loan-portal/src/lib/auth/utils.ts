import { createClient } from '@/lib/supabase/client'

/**
 * Sign out the current user
 */
export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()

  if (!error) {
    // Redirect to login page
    window.location.href = '/auth/login'
  }

  return { error }
}

/**
 * Check if the current user's email is verified
 */
export async function isEmailVerified(): Promise<boolean> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return !!user?.email_confirmed_at
}

/**
 * Get the current user
 */
export async function getCurrentUser() {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  return { user, error }
}

/**
 * Get the current user's profile
 */
export async function getCurrentProfile() {
  const supabase = createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { profile: null, error: userError }
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return { profile, error: profileError }
}

/**
 * Check if user has a specific role
 */
export async function hasRole(role: 'borrower' | 'lender' | 'admin'): Promise<boolean> {
  const { profile } = await getCurrentProfile()
  return profile?.role === role
}

/**
 * Resend email verification
 */
export async function resendVerificationEmail(email: string) {
  const supabase = createClient()

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback?type=signup`,
    },
  })

  return { error }
}
