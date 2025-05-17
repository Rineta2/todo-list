'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    provider?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (status !== 'loading') {
            setLoading(false);
        }
    }, [status]);

    const handleSignIn = async (email: string, password: string) => {
        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                throw new Error(result.error);
            }

            router.push('/todolist');
        } catch (error) {
            throw error;
        }
    };

    const handleSignInWithGoogle = async () => {
        try {
            await signIn('google', { callbackUrl: '/todolist' });
        } catch (error) {
            throw error;
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut({ redirect: false });
            router.push('/signin');
        } catch (error) {
            throw error;
        }
    };

    const value = {
        user: session?.user as User | null,
        loading,
        signIn: handleSignIn,
        signInWithGoogle: handleSignInWithGoogle,
        signOut: handleSignOut,
        isAuthenticated: !!session?.user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
