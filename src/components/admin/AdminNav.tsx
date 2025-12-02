'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Settings, ChevronUp, ChevronDown, User, Shield, Eye, Database, Key } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';
import { Logo } from '@/components/ui/Logo';

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
    <nav className={`sticky top-4 z-50 mx-4 transition-all duration-300 ${isMinimized ? 'mb-4' : 'mb-8'}`}>
      <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full group-hover:bg-blue-500/40 transition-all" />
                <Logo showText={false} iconClassName="w-8 h-8 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
              </div>
              {!isMinimized && (
                <span className="font-bold text-white text-lg tracking-tight flex flex-col leading-none">
                  Orbit
                  <span className="text-[10px] text-blue-400 font-medium uppercase tracking-widest">Admin</span>
                </span>
              )}
            </Link>

            {!isMinimized && (
              <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/5">
                {[
                  { name: 'Dashboard', path: '/admin' },
                  { name: 'Properties', path: '/admin/properties' },
                  { name: 'Users', path: '/admin/users' },
                  { name: 'Bookings', path: '/admin/bookings' },
                  { name: 'Analytics', path: '/admin/analytics' },
                ].map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 relative ${isActive(item.path)
                        ? 'text-white bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!isMinimized && (
              <>
                {/* Settings Dropdown */}
                <div ref={settingsRef} className="relative">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    onMouseEnter={() => setShowSettings(true)}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 ${showSettings ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <Settings className={`w-4 h-4 transition-transform duration-500 ${showSettings ? 'rotate-180' : ''}`} />
                    <span className="text-sm font-medium">Settings</span>
                  </button>

                  {showSettings && (
                    <div
                      className="absolute right-0 mt-4 w-64 bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                      onMouseLeave={() => setShowSettings(false)}
                    >
                      <div className="p-2 space-y-1">
                        {[
                          { icon: User, label: 'User Profile', path: '/admin/profile' },
                          { icon: Shield, label: 'Blacklisted Users', path: '/admin/blacklisted-users' },
                          { icon: Eye, label: 'Audit Logs', path: '/admin/audit-logs' },
                          { icon: Database, label: 'System Settings', path: '/admin/system-settings' },
                          { icon: Key, label: 'API Keys', path: '/admin/api-keys' },
                        ].map((item) => (
                          <button
                            key={item.path}
                            onClick={() => {
                              router.push(item.path);
                              setShowSettings(false);
                            }}
                            className="w-full px-3 py-2.5 flex items-center gap-3 text-zinc-400 hover:bg-white/5 hover:text-white transition-all rounded-xl text-left text-sm group"
                          >
                            <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
                              <item.icon className="w-4 h-4" />
                            </div>
                            <span>{item.label}</span>
                          </button>
                        ))}
                      </div>

                      <div className="p-2 border-t border-white/5">
                        <button
                          onClick={() => signOut({ callbackUrl: '/' })}
                          className="w-full px-3 py-2.5 flex items-center gap-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all rounded-xl text-left text-sm group"
                        >
                          <div className="p-1.5 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
                            <LogOut className="w-4 h-4" />
                          </div>
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
            >
              {isMinimized ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
