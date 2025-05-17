'use client';

import { Session } from "next-auth";

import { SessionProvider } from "next-auth/react";

import { usePathname, useRouter } from 'next/navigation';

import { createContext, useContext, useEffect, useState } from 'react';

import { AuthProvider } from "@/utils/context/AuthContext";

import { ThemeProvider } from '@/base/theme/ThemeProvider';

import Pathname from "@/base/router/Pathname";

interface RouterContextType {
    pathname: string;
    push: (url: string) => void;
    replace: (url: string) => void;
    back: () => void;
}

interface ProvidersProps {
    children: React.ReactNode;
    session: Session | null;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

function RouterProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const value = {
        pathname,
        push: (url: string) => router.push(url),
        replace: (url: string) => router.replace(url),
        back: () => router.back(),
    };

    if (!mounted) {
        return null;
    }

    return (
        <RouterContext.Provider value={value}>
            {children}
        </RouterContext.Provider>
    );
}

export function useRouterContext() {
    const context = useContext(RouterContext);
    if (context === undefined) {
        throw new Error('useRouterContext must be used within a RouterProvider');
    }
    return context;
}

export default function Providers({ children, session }: ProvidersProps) {
    return (
        <SessionProvider session={session}>
            <RouterProvider>
                <AuthProvider>
                    <ThemeProvider>
                        <Pathname>
                            {children}
                        </Pathname>
                    </ThemeProvider>
                </AuthProvider>
            </RouterProvider>
        </SessionProvider>
    );
} 