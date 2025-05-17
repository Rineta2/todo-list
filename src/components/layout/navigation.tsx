import React from 'react'

import { User, Plus, House } from "lucide-react"

import Link from 'next/link'

import { usePathname } from 'next/navigation';

const navLink = [
    {
        id: 1,
        icons: House,
        label: "home",
        href: "/home"
    },
    {
        id: 2,
        icons: Plus,
        label: "Create",
        href: "/todolist"
    },
    {
        id: 3,
        icons: User,
        label: "Profile",
        href: "/profile"
    }
]

export default function Navigation() {

    const pathname = usePathname();

    const isLinkActive = (href: string) => {
        if (href === '/') {
            return pathname === href;
        }
        return pathname?.startsWith(href);
    };

    return (
        <nav className="fixed bottom-2 left-0 right-0 z-[99]">
            <div className="relative max-w-[450px] mx-auto">
                <div className="absolute inset-0 bg-white/30 dark:bg-black/30 rounded-xl blur-xl"></div>
                <div className="relative bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-x border-white/20 dark:border-white/10 rounded-xl p-4 shadow-lg">
                    <ul className="flex justify-between items-center gap-2">
                        {navLink.map((item) => (
                            <li key={item.href} className="flex-1">
                                <Link
                                    href={item.href}
                                    className={`flex flex-col items-center gap-0.5 px-1.5 py-1.5 rounded-xl transition-all duration-300 hover:bg-white/20 dark:hover:bg-white/10 group relative overflow-hidden ${isLinkActive(item.href) ? 'bg-white/20 dark:bg-white/10' : ''}`}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-400/20 dark:from-blue-400/20 dark:to-blue-300/20 transition-all duration-500 ${isLinkActive(item.href) ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}></div>
                                    <item.icons
                                        className={`w-5 h-5 transition-all duration-500 ${isLinkActive(item.href)
                                            ? 'text-blue-500 dark:text-blue-400 scale-110 rotate-0'
                                            : 'text-gray-600 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 group-hover:scale-110 group-hover:rotate-12'
                                            }`}
                                    />
                                    <span className={`text-[10px] font-medium transition-all duration-500 hidden sm:block ${isLinkActive(item.href)
                                        ? 'text-blue-500 dark:text-blue-400 translate-y-0'
                                        : 'text-gray-600 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 group-hover:translate-y-0.5'
                                        }`}>
                                        {item.label}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    )
}
