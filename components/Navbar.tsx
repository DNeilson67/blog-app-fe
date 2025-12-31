'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PenSquare, Home, User, LogIn, LogOut } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (path: string) => pathname === path;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
            BlogApp
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-gray-900 ${
                isActive('/') ? 'text-gray-900' : 'text-gray-600'
              }`}
            >
              <Home className="h-4 w-4" />
              Home
            </Link>

            {user && (
              <>
                <Link
                  href="/create"
                  className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-gray-900 ${
                    isActive('/create') ? 'text-gray-900' : 'text-gray-600'
                  }`}
                >
                  <PenSquare className="h-4 w-4" />
                  Create Post
                </Link>

                <Link
                  href="/profile"
                  className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-gray-900 ${
                    isActive('/profile') ? 'text-gray-900' : 'text-gray-600'
                  }`}
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link href="/profile" className="hidden md:flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.profilePicture} alt={user.name} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                </Link>
                <Button onClick={logout} variant="outline" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {user && (
          <div className="flex md:hidden items-center gap-4 mt-4 pt-4 border-t">
            <Link
              href="/"
              className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-gray-900 ${
                isActive('/') ? 'text-gray-900' : 'text-gray-600'
              }`}
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link
              href="/create"
              className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-gray-900 ${
                isActive('/create') ? 'text-gray-900' : 'text-gray-600'
              }`}
            >
              <PenSquare className="h-4 w-4" />
              Create
            </Link>
            <Link
              href="/profile"
              className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-gray-900 ${
                isActive('/profile') ? 'text-gray-900' : 'text-gray-600'
              }`}
            >
              <User className="h-4 w-4" />
              Profile
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
