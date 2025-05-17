import React from 'react'
import { User, Search, Bell } from 'lucide-react'
import { ThemeToggle } from "@/base/theme/ThemeToggle"
import { useAuth } from '@/utils/context/AuthContext'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Header() {
    const { user, isAuthenticated, signOut } = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await signOut();
            router.push('/signin');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <header className="fixed top-4 left-0 right-0 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-x border-white/20 dark:border-white/10 rounded-xl p-4 shadow-lg z-50 max-w-2xl mx-auto">
            <div className="flex items-center justify-between h-full gap-4">
                {/* Search Bar */}
                <div className="flex-1 w-full mx-2 sm:mx-4">
                    <div className="relative group w-full">
                        <input
                            type="text"
                            placeholder="Search anime..."
                            className="w-full h-10 pl-10 pr-4 bg-transparent text-[var(--text)] placeholder-[var(--text-secondary)] border-b border-[var(--header-border)] focus:border-primary transition-all duration-300 outline-none text-sm"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />

                        {/* Search Results Dropdown */}
                        {/* {showResults && (searchQuery.trim() !== '' || isLoading) && (
                        <div className="absolute top-full left-0 right-0 w-full mt-2 bg-[var(--header-bg)] border border-[var(--header-border)] rounded-lg shadow-lg z-50 max-h-[70vh] overflow-y-auto">
                            {isLoading ? (
                                <div className="p-4 text-center text-[var(--text-secondary)]">
                                    Loading...
                                </div>
                            ) : searchResults.length === 0 ? (
                                <div className="p-4 text-center text-[var(--text-secondary)]">
                                    No results found
                                </div>
                            ) : (
                                <div className="py-2">
                                    {searchResults.map((result, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleResultClick(result.href)}
                                            className="flex items-center gap-3 px-4 py-2 hover:bg-[var(--hover-bg)] cursor-pointer transition-colors duration-200"
                                        >
                                            <div className="relative w-12 h-16 flex-shrink-0">
                                                <Image
                                                    src={result.poster || '/images/no-image.png'}
                                                    alt={result.title}
                                                    fill
                                                    className="object-cover rounded"
                                                    unoptimized
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-medium text-[var(--text)] line-clamp-1">
                                                    {result.title}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded">
                                                        {result.type}
                                                    </span>
                                                    <span className="text-xs text-[var(--text-secondary)]">
                                                        Score: {result.score}
                                                    </span>
                                                    <span className="text-xs text-[var(--text-secondary)]">
                                                        {result.status}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {result.genreList.slice(0, 3).map((genre, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="text-xs text-[var(--text-secondary)] px-1.5 py-0.5 bg-[var(--hover-bg)] rounded"
                                                        >
                                                            {genre.title}
                                                        </span>
                                                    ))}
                                                    {result.genreList.length > 3 && (
                                                        <span className="text-xs text-[var(--text-secondary)]">
                                                            +{result.genreList.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )} */}
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
                    {/* Actions */}
                    <div className="hidden sm:flex items-center gap-2 lg:gap-3">
                        <div className="relative group">
                            <div className="flex items-center gap-2 px-3 py-2 hover:bg-[var(--hover-bg)] rounded-lg transition-all duration-300 group cursor-pointer">
                                <Bell className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-primary transition-colors duration-300" />
                            </div>
                        </div>
                    </div>

                    {/* Mobile Actions */}
                    <div className="flex sm:hidden items-center gap-1">
                        <div className="relative">
                            <div className="p-2 hover:bg-[var(--hover-bg)] rounded-lg transition-all duration-300 cursor-pointer">
                                <Bell className="w-4 h-4 text-[var(--text-secondary)]" />
                            </div>
                        </div>
                    </div>

                    {/* Profile */}
                    {isAuthenticated ? (
                        <div className="relative group">
                            <div className="flex items-center gap-2 px-3 py-2 hover:bg-[var(--hover-bg)] rounded-lg transition-all duration-300 cursor-pointer">
                                {user?.image ? (
                                    <Image
                                        src={user.image}
                                        alt={user.name || 'Profile'}
                                        width={32}
                                        height={32}
                                        className="rounded-full"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <User className="w-4 h-4 text-primary" />
                                    </div>
                                )}
                                <span className="hidden sm:block text-sm font-medium">
                                    {user?.name || user?.email}
                                </span>
                            </div>
                            {/* Profile Dropdown */}
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 hidden group-hover:block">
                                <div className="py-2">
                                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                        Profile
                                    </Link>
                                    <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                        Settings
                                    </Link>
                                    <button
                                        onClick={handleSignOut}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Link
                            href="/signin"
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-all duration-300"
                        >
                            Sign in
                        </Link>
                    )}

                    {/* Theme Toggle */}
                    <ThemeToggle />
                </div>
            </div>
        </header>
    )
}
