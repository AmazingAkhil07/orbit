'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showCredentials, setShowCredentials] = useState(false);
    const router = useRouter();

    const handleCredentialsSubmit = async (e: React.FormEvent) => {
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
                router.push('/');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-zinc-950">
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            <Card className="w-full max-w-md relative z-10 border-zinc-800 bg-zinc-900/50 backdrop-blur-xl shadow-2xl">
                <CardHeader className="text-center space-y-4 pb-2">
                    <div className="mx-auto w-16 h-16 flex items-center justify-center mb-2">
                        <Logo showText={false} iconClassName="w-12 h-12 text-white" />
                    </div>
                    <div className="space-y-1">
                        <CardTitle className="text-2xl font-bold tracking-tight text-white">
                            Welcome to Orbit
                        </CardTitle>
                        <CardDescription className="text-zinc-400">
                            Your gateway to premium student living
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    {!showCredentials ? (
                    <div className="space-y-4">
                        <Button
                            size="lg"
                            className="w-full py-6 text-base font-medium bg-white text-black hover:bg-zinc-200 shadow-lg shadow-zinc-900/20 transition-all duration-300 hover:scale-[1.02] border-0"
                            onClick={() => signIn('auth0', { callbackUrl: '/' })}
                            suppressHydrationWarning
                        >
                            Sign in / Sign up
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="w-full py-6 text-base font-medium border-zinc-700 text-white hover:bg-zinc-800 transition-all duration-300"
                            onClick={() => setShowCredentials(true)}
                        >
                            Sign in with Email
                        </Button>

                        <div className="text-center space-y-4">
                            <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
                                Securely continue with
                            </p>
                            <div className="flex justify-center gap-4 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                                {/* Icons representing available providers in Auth0 */}
                                <div className="flex items-center gap-2 text-xs font-medium bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Google
                                </div>
                                <div className="flex items-center gap-2 text-xs font-medium bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800">
                                    <span className="w-1.5 h-1.5 rounded-full bg-white" /> Apple
                                </div>
                                <div className="flex items-center gap-2 text-xs font-medium bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800">
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Microsoft
                                </div>
                            </div>
                        </div>
                    </div>
                    ) : (
                    <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-xs text-blue-200 flex gap-2">
                            <Shield className="w-4 h-4 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium mb-1">Demo Accounts:</p>
                                <p><strong>User:</strong> user@orbit.com / password</p>
                                <p><strong>Owner:</strong> owner@orbit.com / password</p>
                            </div>
                        </div>
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
                                className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-zinc-600"
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
                                className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-zinc-600"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black hover:bg-zinc-200 font-medium py-3 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                                setShowCredentials(false);
                                setError('');
                                setEmail('');
                                setPassword('');
                            }}
                            className="w-full text-zinc-400 hover:text-white"
                        >
                            Back
                        </Button>
                    </form>
                    )}

                    <div className="pt-6 border-t border-zinc-800/50">
                        <div className="grid grid-cols-2 gap-3 text-xs text-zinc-500">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                <span>Verified Listings</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                <span>Secure Payments</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                <span>Direct Chat</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                <span>24/7 Support</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="absolute bottom-8 text-center text-sm text-zinc-600">
                <Link href="/" className="hover:text-white transition-colors">
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
