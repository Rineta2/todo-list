import React from 'react'

import Image from 'next/image'

import homescreenImg from "@/base/assets/homescreenImg.jpg"

import Link from 'next/link'

export default function HomeScreen() {

    return (
        <section className="flex items-center justify-center min-h-screen p-4 sm:p-8 bg-gradient-to-br from-primary via-accent to-secondary">
            <div className="container flex flex-col md:flex-row bg-card-bg backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden"
                style={{ maxWidth: '1000px', minHeight: '600px' }}>
                {/* Left Section */}
                <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 flex flex-col justify-between">
                    <div>
                        {/* App Logo */}
                        <div className="mb-4 sm:mb-8">
                            <span className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Task</span>
                        </div>

                        <h2 className="text-xs sm:text-sm font-medium text-text-secondary mb-2 tracking-wider">Welcome to</h2>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-text mb-4 sm:mb-8 tracking-tight">Todo List</h1>

                        <div className="space-y-2 sm:space-y-3">
                            <p className="text-xs sm:text-sm text-text-secondary">© 2025 <a href="https://spacedigitalia.my.id" className="text-primary hover:text-primary-hover">Space Digitalia</a>. All rights reserved</p>
                            <p className="text-xs sm:text-sm text-text-secondary">Organize your tasks efficiently and boost your productivity</p>
                            <p className="text-xs sm:text-sm text-text-secondary">Create, manage, and track your daily tasks with ease</p>
                        </div>
                    </div>

                    {/* App Tagline */}
                    <div className="mt-6 sm:mt-8">
                        <Link
                            href="/signin"
                            className="inline-block text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hover:opacity-80 transition-opacity px-4 py-2 cursor-pointer">
                            Let&apos;s Start
                        </Link>
                    </div>
                </div>

                {/* Right Section - Illustration */}
                <div className="w-full md:w-1/2 relative h-64 md:h-auto z-50">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 mix-blend-overlay" />
                    <Image
                        src={homescreenImg}
                        alt="Task Management Illustration"
                        layout="fill"
                        objectFit="cover"
                        className="object-cover"
                    />
                </div>
            </div>
        </section>
    )
}
