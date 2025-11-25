'use client';

import { useEffect, useState } from 'react';
import { ChatWidget as ChatWidgetComponent } from './ChatWidget';
import { useSession } from 'next-auth/react';

export function ChatWidgetWrapper() {
    const [mounted, setMounted] = useState(false);
    const { data: session, status } = useSession();
    const userRole = (session?.user as any)?.role || 'student';

    useEffect(() => {
        console.log('ChatWidgetWrapper - Session:', session);
        console.log('ChatWidgetWrapper - Status:', status);
        console.log('ChatWidgetWrapper - User Role:', userRole);
        setMounted(true);
    }, [session, status, userRole]);

    // Don't render anything on server to avoid hydration mismatch
    if (!mounted) {
        return null;
    }

    return <ChatWidgetComponent userRole={userRole} />;
}
