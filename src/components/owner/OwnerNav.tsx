'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Settings, User, Menu, X, Search } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';
import { Logo } from '@/components/ui/Logo';

export function OwnerNav() {
  const pathname = usePathname();
  const [showSettings, setShowSettings] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => pathname === path;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { name: 'Dashboard', path: '/owner/dashboard' },
    { name: 'Properties', path: '/owner/properties' },
    { name: 'Bookings', path: '/owner/bookings' },
    { name: 'Reviews', path: '/owner/reviews' },
    { name: 'Analytics', path: '/owner/analytics' },
    { name: 'Payments', path: '/owner/payments' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-900/90 backdrop-blur-xl border-b border-white/10">
      <div className="mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo - Compact */}
        <Link href="/owner/dashboard" className="flex items-center gap-2 group shrink-0">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 blur-lg rounded-full group-hover:bg-emerald-500/40 transition-all" />
            <Logo showText={false} iconClassName="w-6 h-6 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="hidden lg:flex flex-col leading-none">
            <span className="font-bold text-white text-xs">Orbit</span>
            <span className="text-[8px] text-emerald-400 font-bold uppercase">Owner</span>
          </div>
        </Link>

        {/* Desktop Navigation - Responsive */}
        <div className="hidden md:flex items-center gap-0.5 bg-white/5 rounded-full px-1.5 py-1 border border-white/5">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 whitespace-nowrap ${
                isActive(item.path)
                  ? 'text-white bg-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center gap-2 ml-auto">
          <button className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors hidden sm:flex">
            <Search className="w-4 h-4" />
          </button>

          {/* Settings Dropdown */}
          <div ref={settingsRef} className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-lg transition-all duration-300 ${
                showSettings ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Settings className={`w-4 h-4 transition-transform duration-500 ${showSettings ? 'rotate-180' : ''}`} />
            </button>

            {showSettings && (
              <div
                className="absolute right-0 mt-2 w-56 bg-black/95 border border-white/10 rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                onMouseLeave={() => setShowSettings(false)}
              >
                <div className="p-2 space-y-1">
                  <Link
                    href="/owner/profile"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-all group"
                    onClick={() => setShowSettings(false)}
                  >
                    <User className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                    My Profile
                  </Link>
                  <Link
                    href="/owner/settings"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-all group"
                    onClick={() => setShowSettings(false)}
                  >
                    <Settings className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                    Settings
                  </Link>

                  <div className="h-px bg-white/10 my-1" />

                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all group"
                  >
                    <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            {showMobileMenu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-white/10 bg-zinc-900/90 backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(item.path)
                    ? 'text-white bg-emerald-500/20'
                    : 'text-zinc-300 hover:text-white hover:bg-white/5'
                }`}
                onClick={() => setShowMobileMenu(false)}
              >
                {item.name}
              </Link>
              ))}
          </div>
        </div>
      )}
    </nav>
  );
}