import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

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
  const protectedPrefixes = ['/borrower', '/lender', '/admin']
  const isProtectedRoute = protectedPrefixes.some((prefix) => pathname.startsWith(prefix))

  // If route is protected and user is not authenticated, redirect to login
  if (isProtectedRoute && !user) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If authenticated on a protected route, verify role from user metadata
  if (isProtectedRoute && user) {
    // Role is stored in user_metadata at signup
    const role = (user as any)?.user_metadata?.role ?? null

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

  return supabaseResponse ?? NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
