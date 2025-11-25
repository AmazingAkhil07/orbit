'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Settings, ChevronUp, ChevronDown, User, Shield, Eye, Database, Key } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
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

  return (
    <nav className={`bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 sticky top-0 z-50 transition-all duration-300 ${isMinimized ? 'py-2' : 'py-4'}`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              A
            </div>
            {!isMinimized && <span className="font-bold text-white text-lg">Orbit Admin</span>}
          </Link>

          {!isMinimized && (
            <div className="hidden md:flex items-center gap-1">
              <Link
                href="/admin"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isActive('/admin')
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/admin/properties"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isActive('/admin/properties')
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                Properties
              </Link>
              <Link
                href="/admin/users"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isActive('/admin/users')
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                Users
              </Link>
              <Link
                href="/admin/bookings"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isActive('/admin/bookings')
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                Bookings
              </Link>
              <Link
                href="/admin/analytics"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isActive('/admin/analytics')
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                Analytics
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {!isMinimized && (
            <>
              {/* Settings Dropdown */}
              <div ref={settingsRef} className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  onMouseEnter={() => setShowSettings(true)}
                  className="inline-flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
                  title="Settings menu"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>

                {showSettings && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                    onMouseLeave={() => setShowSettings(false)}
                  >
                    {/* User Profile */}
                    <button
                      onClick={() => {
                        router.push('/admin/profile');
                        setShowSettings(false);
                      }}
                      className="w-full px-4 py-3 flex items-center gap-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border-b border-slate-700 text-left"
                    >
                      <User className="w-4 h-4" />
                      <span>User Profile</span>
                    </button>

                    {/* Blacklisted Users */}
                    <button
                      onClick={() => {
                        router.push('/admin/blacklisted-users');
                        setShowSettings(false);
                      }}
                      className="w-full px-4 py-3 flex items-center gap-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border-b border-slate-700 text-left"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Blacklisted Users</span>
                    </button>

                    {/* Audit Logs */}
                    <button
                      onClick={() => {
                        router.push('/admin/audit-logs');
                        setShowSettings(false);
                      }}
                      className="w-full px-4 py-3 flex items-center gap-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border-b border-slate-700 text-left"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Audit Logs</span>
                    </button>

                    {/* System Settings */}
                    <button
                      onClick={() => {
                        router.push('/admin/system-settings');
                        setShowSettings(false);
                      }}
                      className="w-full px-4 py-3 flex items-center gap-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border-b border-slate-700 text-left"
                    >
                      <Database className="w-4 h-4" />
                      <span>System Settings</span>
                    </button>

                    {/* API Keys */}
                    <button
                      onClick={() => {
                        router.push('/admin/api-keys');
                        setShowSettings(false);
                      }}
                      className="w-full px-4 py-3 flex items-center gap-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-left"
                    >
                      <Key className="w-4 h-4" />
                      <span>API Keys</span>
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="inline-flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          )}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="inline-flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </nav>
  );
}
