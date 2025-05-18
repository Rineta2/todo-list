import React, { useState } from 'react'

import { User, Bell } from 'lucide-react'

import { ThemeToggle } from "@/base/theme/ThemeToggle"

import { useAuth } from '@/utils/context/AuthContext'

import Image from 'next/image'

import { useRouter } from 'next/navigation'

export default function Header() {
    const { user, signOut } = useAuth();
    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleSignOut = async () => {
        try {
            await signOut();
            router.push('/signin');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <header className="fixed top-4 left-0 right-0 px-2 z-[99]">
            <div className="flex items-center justify-between h-full bg-white/90 dark:bg-black/90 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-4 shadow-lg z-50 max-w-[500px] mx-auto transition-all duration-300 hover:bg-white/95 dark:hover:bg-black/95">
                <div className="flex items-center gap-3">
                    {/* Profile */}
                    <div className="relative">
                        <div
                            className="flex items-center gap-3 px-2 sm:px-4 py-2.5 hover:bg-[var(--hover-bg)] rounded-xl transition-all duration-300 cursor-pointer"
                            onMouseEnter={() => setIsDropdownOpen(true)}
                            onMouseLeave={() => setIsDropdownOpen(false)}
                        >
                            {user?.image ? (
                                <Image
                                    src={user.image}
                                    alt={user.name || 'Profile'}
                                    width={36}
                                    height={36}
                                    className="rounded-full ring-2 ring-primary/20"
                                />
                            ) : (
                                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                                    <User className="w-5 h-5 text-primary" />
                                </div>
                            )}

                            <span className="hidden sm:block text-sm font-medium text-[var(--text-primary)]">
                                {user?.name || user?.email}
                            </span>
                        </div>
                        {/* Profile Dropdown */}
                        <div
                            className={`absolute -right-8 top-full mt-5 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 transform origin-top transition-all duration-200 ${isDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                            onMouseEnter={() => setIsDropdownOpen(true)}
                            onMouseLeave={() => setIsDropdownOpen(false)}
                        >
                            <div className="py-2">
                                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                    <p className="text-sm font-medium text-[var(--text-primary)]">{user?.name}</p>
                                    <p className="text-xs text-[var(--text-secondary)]">{user?.email}</p>
                                </div>
                                <button
                                    onClick={handleSignOut}
                                    className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                                >
                                    Sign out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <div className="flex items-center gap-2 px-4 py-2.5 hover:bg-[var(--hover-bg)] rounded-xl transition-all duration-300 cursor-pointer">
                                <Bell className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-primary transition-colors duration-300" />
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </div>
                        </div>
                    </div>
                    <ThemeToggle />
                </div>
            </div>
        </header>
    )
}
