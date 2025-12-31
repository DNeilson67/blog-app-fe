'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { isStoredTokenValid } from '@/lib/tokenUtils';

/**
 * SessionGuard component that automatically redirects to login
 * if the session is expired or invalid
 */
export function SessionGuard({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if we're on a public route
    const publicRoutes = ['/login', '/register', '/'];
    const isPublicRoute = publicRoutes.includes(pathname);

    if (!isPublicRoute && !isStoredTokenValid()) {
      console.log('Session invalid, redirecting to login...');
      router.push('/login');
    }
  }, [pathname, router, user, token]);

  return <>{children}</>;
}

/**
 * ProtectedRoute component for individual page protection
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || !isStoredTokenValid()) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
