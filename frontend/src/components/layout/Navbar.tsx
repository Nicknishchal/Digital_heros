'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/utils/cn';
import { Trophy, Heart, LayoutDashboard, LogOut, Menu, ShieldAlert } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <Link href="/" className="text-xl font-bold font-outfit tracking-tight">
              Digital<span className="text-primary">Heroes</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/charities" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Charities
            </Link>
            <Link href="/draws" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Monthly Draws
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                {user.is_superuser && (
                  <Link href="/admin" className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                    <ShieldAlert className="w-4 h-4" />
                    Admin
                  </Link>
                )}
                <button 
                  onClick={logout}
                  className="flex items-center gap-2 text-sm font-medium text-destructive hover:text-destructive/80 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
                  Login
                </Link>
                <Link 
                  href="/signup" 
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden glass border-b border-white/5 px-4 py-4 space-y-4">
          <Link href="/charities" className="block text-base font-medium">Charities</Link>
          <Link href="/draws" className="block text-base font-medium">Monthly Draws</Link>
          {user ? (
            <>
              <Link href="/dashboard" className="block text-base font-medium">Dashboard</Link>
              {user.is_superuser && (
                <Link href="/admin" className="block text-base font-medium text-primary">Admin Panel</Link>
              )}
              <button onClick={logout} className="block text-base font-medium text-destructive">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="block text-base font-medium">Login</Link>
              <Link href="/signup" className="block text-base font-medium text-primary">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
