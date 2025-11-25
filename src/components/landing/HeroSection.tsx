'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, MapPin, Users, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function HeroSection() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Animated Background with Glassmorphism */}
            <div className="absolute inset-0 z-0">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-purple-950 to-black" />
                
                {/* Animated Orbs */}
                <div className="absolute inset-0">
                    <motion.div 
                        animate={{ 
                            x: mousePosition.x * 0.02,
                            y: mousePosition.y * 0.02,
                        }}
                        transition={{ type: "spring", stiffness: 150, damping: 30 }}
                        className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-3xl"
                    />
                    <motion.div 
                        animate={{ 
                            x: mousePosition.x * -0.01,
                            y: mousePosition.y * -0.01,
                        }}
                        transition={{ type: "spring", stiffness: 100, damping: 30 }}
                        className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
                    />
                    <motion.div 
                        animate={{ 
                            x: mousePosition.x * 0.015,
                            y: mousePosition.y * -0.02,
                        }}
                        transition={{ type: "spring", stiffness: 120, damping: 25 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-500/25 to-blue-500/25 rounded-full blur-2xl"
                    />
                </div>
                
                {/* Animated Grid Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="h-full w-full" style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px',
                        animation: 'grid-move 20s linear infinite'
                    }} />
                </div>
                
                {/* Video Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-10" />
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-20"
                >
                    <source src="https://cdn.coverr.co/videos/coverr-modern-student-housing-interior-5349/1080p.mp4" type="video/mp4" />
                    <div className="w-full h-full bg-gradient-to-br from-blue-950 to-purple-950" />
                </video>
            </div>

            {/* Enhanced Content */}
            <div className="relative z-20 container mx-auto px-4 text-center">
                {/* Floating Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 100 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-8 hover:bg-white/15 transition-all duration-300 shadow-2xl">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 animate-pulse" />
                        <span className="text-sm font-semibold text-white tracking-wide">Premium Student Living</span>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
                    </div>
                </motion.div>

                {/* Hero Title with Stunning Gradient */}
                <motion.h1
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.4, type: "spring", stiffness: 50 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 tracking-tight leading-none"
                >
                    Find Your{' '}
                    <span className="relative inline-block">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient-x">
                            Orbit
                        </span>
                        <motion.div 
                            className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-lg blur opacity-20"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </span>
                </motion.h1>

                {/* Enhanced Description */}
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="text-xl md:text-2xl text-zinc-200 max-w-3xl mx-auto mb-12 leading-relaxed font-light"
                >
                    Experience the{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 font-semibold">
                        next generation
                    </span>{' '}
                    of student housing.
                    <br className="hidden md:block" />
                    Curated spaces, verified communities, and seamless booking.
                </motion.p>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="flex flex-wrap justify-center gap-6 mb-12"
                >
                    {[
                        { icon: MapPin, value: '500+', label: 'Verified PGs' },
                        { icon: Users, value: '10K+', label: 'Happy Students' },
                        { icon: Shield, value: '100%', label: 'Verified' }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 min-w-[140px] hover:bg-white/10 transition-all duration-300 shadow-xl"
                        >
                            <stat.icon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                            <div className="text-sm text-zinc-300">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Enhanced Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-6"
                >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                            size="lg" 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full px-10 h-14 text-lg font-semibold shadow-2xl shadow-blue-500/25 border-0 transition-all duration-300"
                        >
                            <span className="flex items-center gap-2">
                                Explore Spaces
                                <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                                    <ArrowRight className="w-5 h-5" />
                                </motion.div>
                            </span>
                        </Button>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                            size="lg" 
                            variant="outline" 
                            className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 rounded-full px-10 h-14 text-lg font-semibold backdrop-blur-xl transition-all duration-300"
                        >
                            How it Works
                        </Button>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
            >
                <div className="w-[30px] h-[50px] rounded-full border-2 border-white/30 flex justify-center p-2">
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        className="w-1.5 h-1.5 rounded-full bg-white"
                    />
                </div>
            </motion.div>
        </section>
    );
}
