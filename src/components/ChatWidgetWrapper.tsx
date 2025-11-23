'use client';

import { useEffect, useState } from 'react';
import { ChatWidget as ChatWidgetComponent } from './ChatWidget';

export function ChatWidgetWrapper() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Don't render anything on server to avoid hydration mismatch
    if (!mounted) {
        return null;
    }

    return <ChatWidgetComponent />;
}
