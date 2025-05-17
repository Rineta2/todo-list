import React from 'react'

import { Metadata } from 'next'

import SignupLayout from "@/hooks/(auth)/signup/SignupLayout"

export const metadata: Metadata = {
    title: 'Sign Up',
    description: 'Sign Up to your account',
}

export default function SignUpPage() {
    return (
        <SignupLayout />
    )
}
