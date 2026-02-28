import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  const type = searchParams.get('type')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Check if this is an email confirmation
      if (type === 'signup') {
        // Redirect to a confirmation success page
        return NextResponse.redirect(`${origin}/auth/confirmed`)
      }

      // Check if this is a password reset
      if (type === 'recovery') {
        // Redirect to password reset form
        return NextResponse.redirect(`${origin}/auth/update-password`)
      }

      // Default: redirect to next or home
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // URL to redirect to after sign up process completes
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
