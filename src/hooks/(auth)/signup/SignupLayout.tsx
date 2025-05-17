"use client";

import { Button, Label, TextInput } from 'flowbite-react';

import { FcGoogle } from 'react-icons/fc';

import { FaEye, FaEyeSlash } from 'react-icons/fa';

import Image from 'next/image';

import Link from 'next/link';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { z } from 'zod';

import { signupSchema, type SignupFormData } from '@/utils/validations/auth';
import { signIn } from 'next-auth/react';

export default function SignupLayout() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState<SignupFormData>({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState<Partial<Record<keyof SignupFormData, string>>>({});
    const [loading, setLoading] = useState(false);
    const [activeMethod, setActiveMethod] = useState<'email' | 'google'>('email');

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name as keyof SignupFormData]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const validateForm = () => {
        try {
            signupSchema.parse(formData);
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors: Partial<Record<keyof SignupFormData, string>> = {};
                error.errors.forEach((err) => {
                    if (err.path[0]) {
                        newErrors[err.path[0] as keyof SignupFormData] = err.message;
                    }
                });
                setErrors(newErrors);
            }
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validate form using Zod
            if (!validateForm()) {
                toast.error('Validation Error', {
                    description: 'Please check your input fields',
                    duration: 5000,
                });
                return;
            }

            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            // Show success toast
            toast.success('Account created successfully!', {
                description: 'Please sign in with your new account',
                duration: 5000,
            });

            // Redirect to signin page instead of auto-login
            router.push('/signin');
        } catch (error) {
            const err = error as Error;
            // Show error toast
            toast.error('Registration failed', {
                description: err.message || 'Something went wrong',
                duration: 5000,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            setLoading(true);
            const result = await signIn('google', {
                redirect: false,
            });

            if (result?.error) {
                throw new Error(result.error);
            }

            // Show success toast
            toast.success('Signed in successfully!', {
                description: 'Welcome!',
                duration: 5000,
            });

            // Redirect to todolist
            router.push('/todolist');
        } catch {
            toast.error('Google Sign In Failed', {
                description: 'Please try again later',
                duration: 5000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 p-4">
            <div className="flex w-full max-w-7xl bg-card-bg rounded-3xl shadow-2xl overflow-hidden">
                {/* Left: Image */}
                <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-card-bg p-8 relative">
                    <button
                        onClick={() => router.back()}
                        className="absolute top-4 left-4 bg-card-bg rounded-full p-2 shadow-md hover:bg-hover transition"
                    >
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <div className="relative w-full h-[600px]">
                        <Image
                            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
                            fill
                            alt="Signup Visual"
                            className="object-cover rounded-2xl"
                            priority
                        />
                    </div>
                </div>
                {/* Right: Form */}
                <div className="flex-1 flex flex-col justify-center p-8 md:p-12 lg:p-16">
                    <div className="flex flex-col space-y-6 w-full">
                        <h2 className="text-3xl font-bold mb-6 text-text text-center">Create an Account</h2>

                        {/* Sign Up Method Tabs */}
                        <div className="flex space-x-4 mb-6">
                            <button
                                onClick={() => setActiveMethod('email')}
                                className={`flex-1 py-2 px-4 rounded-lg transition-colors ${activeMethod === 'email'
                                    ? 'bg-primary text-white'
                                    : 'bg-hover text-text-secondary hover:bg-hover'
                                    }`}
                            >
                                Email Sign Up
                            </button>
                            <button
                                onClick={() => setActiveMethod('google')}
                                className={`flex-1 py-2 px-4 rounded-lg transition-colors ${activeMethod === 'google'
                                    ? 'bg-primary text-white'
                                    : 'bg-hover text-text-secondary hover:bg-hover'
                                    }`}
                            >
                                Google Sign Up
                            </button>
                        </div>

                        <div className="space-y-6">
                            {activeMethod === 'email' ? (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <Label htmlFor="name" className="text-text">Name</Label>
                                        <TextInput
                                            id="name"
                                            name="name"
                                            type="text"
                                            placeholder="Enter your name"
                                            required
                                            className={`mt-1 ${errors.name ? 'border-error' : 'border-border'}`}
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-error">{errors.name}</p>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="email" className="text-text">Email</Label>
                                        <TextInput
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="Enter your email"
                                            required
                                            className={`mt-1 ${errors.email ? 'border-error' : 'border-border'}`}
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-error">{errors.email}</p>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <Label htmlFor="password" className="text-text">Password</Label>
                                        <TextInput
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            required
                                            className={`mt-1 ${errors.password ? 'border-error' : 'border-border'}`}
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="absolute right-3 top-[38px] text-text-secondary hover:text-text"
                                        >
                                            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                        </button>
                                        {errors.password && (
                                            <p className="mt-1 text-sm text-error">{errors.password}</p>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <Label htmlFor="confirmPassword" className="text-text">Confirm Password</Label>
                                        <TextInput
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm your password"
                                            required
                                            className={`mt-1 ${errors.confirmPassword ? 'border-error' : 'border-border'}`}
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                        />
                                        <button
                                            type="button"
                                            onClick={toggleConfirmPasswordVisibility}
                                            className="absolute right-3 top-[38px] text-text-secondary hover:text-text"
                                        >
                                            {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                        </button>
                                        {errors.confirmPassword && (
                                            <p className="mt-1 text-sm text-error">{errors.confirmPassword}</p>
                                        )}
                                    </div>
                                    <Button type="submit" className="w-full bg-primary hover:bg-primary-hover py-4" disabled={loading}>
                                        {loading ? 'Creating Account...' : 'Create Account'}
                                    </Button>
                                </form>
                            ) : (
                                <div className="space-y-6">
                                    <Button
                                        color="light"
                                        onClick={handleGoogleSignIn}
                                        className="w-full flex items-center justify-center gap-2 border border-border shadow-sm hover:bg-hover"
                                        disabled={loading}
                                    >
                                        <FcGoogle className="text-xl" /> {loading ? 'Signing up...' : 'Sign up with Google'}
                                    </Button>
                                    <p className="text-sm text-text-secondary text-center">
                                        By signing up with Google, you agree to our Terms of Service and Privacy Policy
                                    </p>
                                </div>
                            )}

                            <p className="text-sm text-text-secondary text-center mt-6">
                                Already have an account?{' '}
                                <Link href="/signin" className="text-primary hover:text-primary-hover font-medium">Sign in</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}