// src/components/ProtectedRoute.tsx

'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string | string[];
}

/**
 * ProtectedRoute - Wraps components that require authentication
 * Automatically redirects to login if user is not authenticated
 *
 * Usage:
 *   <ProtectedRoute requiredRole="borrower">
 *     <Dashboard />
 *   </ProtectedRoute>
 */
export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const router = useRouter();
  const isAuthenticated = useRequireAuth();

  if (!isAuthenticated) {
    return null; // Will redirect in hook
  }

  if (requiredRole) {
    // Check role permission
    const { profile } = useAuthStore?.((state) => ({
      profile: state.profile,
    })) || {};

    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

    if (!profile || !roles.includes(profile.role)) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
            <p className="text-slate-600 mt-2">
              You don't have permission to access this page.
            </p>
            <button
              onClick={() => router.push('/')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go Home
            </button>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}

/**
 * Import this in your route to protect it
 */
import { useAuthStore } from '@/lib/store/authStore';