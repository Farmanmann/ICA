import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// ─── Stakeholder Demo Bypass ──────────────────────────────────────────────────
// These routes skip auth entirely so the app can be demoed without a backend.
// Remove this block once Supabase is configured and auth is ready.
const DEMO_ROUTES = [
  '/borrower/dashboard',
  '/lender/dashboard',
  '/loans',
]
// ─────────────────────────────────────────────────────────────────────────────

export async function middleware(request: NextRequest) {
  // ─── Stakeholder Demo Mode ────────────────────────────────────────────────
  // Supabase auth fully disabled. Remove this return to re-enable auth.
  return NextResponse.next()
  // ─────────────────────────────────────────────────────────────────────────

  const { pathname } = request.nextUrl

  // Allow demo routes through with no auth check
  if (DEMO_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Skip all Supabase auth if credentials are not configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next()
  }

  let supabaseResponse: ReturnType<typeof import('next/server').NextResponse.next>
  let user: Awaited<ReturnType<typeof updateSession>>['user'] = null

  try {
    ;({ supabaseResponse, user } = await updateSession(request))
  } catch {
    // Supabase is unreachable (e.g. project paused). Treat as unauthenticated.
    supabaseResponse = NextResponse.next()
  }

  // Define protected routes
  const protectedRoutes = {
    borrower: ['/borrower'],
    lender: ['/lender'],
    admin: ['/admin'],
  }

  // Check if current path is protected
  const isProtectedRoute = Object.values(protectedRoutes)
    .flat()
    .some((route) => pathname.startsWith(route))

  // If route is protected and user is not authenticated, redirect to login
  if (isProtectedRoute && !user) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If authenticated, verify role (but NEVER redirect to dashboard)
  if (isProtectedRoute && user) {
    const supabase = (await import('@/lib/supabase/server')).createClient
    const supabaseClient = await supabase()

    // Guard user id (user may be null-ish at the type level)
    const userId = user?.id
    if (!userId) {
      // If we somehow reached this branch without a valid user id, treat as unauthenticated
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Query profile; `data` may be null if the profile doesn't exist
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    // Normalize role access safely (profile can be null)
    const role = (profile as { role?: string } | null)?.role ?? null

    // If no role found, redirect to home
    if (!role) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    if (pathname.startsWith('/borrower') && role !== 'borrower') {
      return NextResponse.redirect(new URL('/', request.url))
    }
    if (pathname.startsWith('/lender') && role !== 'lender') {
      return NextResponse.redirect(new URL('/', request.url))
    }
    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // ✅ Allow authenticated users to access signup pages again
  // (No more auto-redirect to dashboards)

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}