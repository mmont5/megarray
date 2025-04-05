'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-white">
            Megarray
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/features" 
              className={`transition-colors ${pathname === '/features' ? 'text-white' : 'text-gray-300 hover:text-white'}`}
            >
              Features
            </Link>
            <Link 
              href="/#pricing" 
              className={`transition-colors ${pathname === '/#pricing' ? 'text-white' : 'text-gray-300 hover:text-white'}`}
            >
              Pricing
            </Link>
            <Link 
              href="/about" 
              className={`transition-colors ${pathname === '/about' ? 'text-white' : 'text-gray-300 hover:text-white'}`}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className={`transition-colors ${pathname === '/contact' ? 'text-white' : 'text-gray-300 hover:text-white'}`}
            >
              Contact
            </Link>
            <Link
              href="/auth/login"
              className={`transition-colors ${pathname === '/auth/login' ? 'text-white' : 'text-gray-300 hover:text-white'}`}
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className={`bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 transition-colors ${pathname === '/auth/signup' ? 'bg-indigo-500' : ''}`}
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
} 