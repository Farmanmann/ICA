import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request)
  const { pathname } = request.nextUrl

  // 🚫 Completely block all dashboard routes
  const blockedDashboards = [
    '/borrower/dashboard',
    '/lender/dashboard',
    '/admin/dashboard',
  ]

  if (blockedDashboards.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/', request.url))
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

    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile) {
      if (pathname.startsWith('/borrower') && profile.role !== 'borrower') {
        return NextResponse.redirect(new URL('/', request.url))
      }
      if (pathname.startsWith('/lender') && profile.role !== 'lender') {
        return NextResponse.redirect(new URL('/', request.url))
      }
      if (pathname.startsWith('/admin') && profile.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url))
      }
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