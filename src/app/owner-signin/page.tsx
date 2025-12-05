'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/Logo';
import Link from 'next/link';
import { Building2, AlertCircle } from 'lucide-react';

export default function OwnerSignIn() {
  const [email, setEmail] = useState('owner@orbit.com');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials. Please try again.');
      } else if (result?.ok) {
        router.push('/owner/dashboard');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
        <div className="absolute top-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-emerald-600/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[300px] w-[300px] rounded-full bg-teal-600/20 blur-[100px] animate-pulse delay-700" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <div className="flex items-center justify-center gap-2">
              <Logo showText={true} iconClassName="w-8 h-8 text-emerald-400" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Owner Sign In</h1>
          <p className="text-zinc-400">Access your property dashboard</p>
        </div>

        {/* Demo Credentials Card */}
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-6">
          <div className="flex gap-3">
            <Building2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-emerald-200 font-medium mb-2">Demo Credentials:</p>
              <p className="text-emerald-300 font-mono text-xs mb-1">Email: <span className="font-bold">owner@orbit.com</span></p>
              <p className="text-emerald-300 font-mono text-xs">Password: <span className="font-bold">password</span></p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder-zinc-600"
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder-zinc-600"
              placeholder="••••••••"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-3 rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In as Owner'}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center space-y-4">
          <p className="text-sm text-zinc-400">
            Don't have an owner account? <span className="text-emerald-400">Contact support</span>
          </p>
          <div className="flex gap-2 justify-center">
            <Link href="/api/auth/signin" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
              Student Login
            </Link>
            <span className="text-zinc-600">•</span>
            <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
              Back Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
