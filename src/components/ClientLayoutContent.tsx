'use client';

import { useEffect, useState } from 'react';

export function ClientLayoutContent({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);
    const [NavbarComponent, setNavbarComponent] = useState<any>(null);
    const [ChatComponent, setChatComponent] = useState<any>(null);

    useEffect(() => {
        const loadComponents = async () => {
            try {
                const navbar = await import('@/components/Navbar').then(m => m.Navbar);
                const chat = await import('@/components/ChatWidgetWrapper').then(m => m.ChatWidgetWrapper);
                setNavbarComponent(() => navbar);
                setChatComponent(() => chat);
            } catch (error) {
                console.error('Error loading components:', error);
            }
            setMounted(true);
        };

        loadComponents();
    }, []);

    return (
        <>
            {mounted && NavbarComponent ? <NavbarComponent /> : <div className="h-16 border-b border-zinc-800" />}
            <main className="flex-1">
                {children}
            </main>
            {mounted && ChatComponent && <ChatComponent />}
        </>
    );
}
