'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ApiClient from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function RegisterPage() {
    const router = useRouter();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await ApiClient.auth.register(email, password, firstName, lastName);
            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen px-5">
            <div className="w-full max-w-md p-10 border-2 border-gray-800 rounded-2xl bg-white">
                <h1 className="text-3xl mb-8 text-center">Register</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <Label htmlFor="firstName" className="block mb-2 font-medium text-gray-700">
                            First Name
                        </Label>
                        <Input
                            type="text"
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            className="border-2 border-gray-800 rounded-lg"
                        />
                    </div>

                    <div className="mb-5">
                        <Label htmlFor="lastName" className="block mb-2 font-medium text-gray-700">
                            Last Name
                        </Label>
                        <Input
                            type="text"
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            className="border-2 border-gray-800 rounded-lg"
                        />
                    </div>

                    <div className="mb-5">
                        <Label htmlFor="email" className="block mb-2 font-medium text-gray-700">
                            Email
                        </Label>
                        <Input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="border-2 border-gray-800 rounded-lg"
                        />
                    </div>

                    <div className="mb-5">
                        <Label htmlFor="password" className="block mb-2 font-medium text-gray-700">
                            Password
                        </Label>
                        <Input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="border-2 border-gray-800 rounded-lg"
                        />
                    </div>

                    {error && (
                        <div className="text-red-600 bg-red-50 p-3 rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="text-green-700 bg-green-50 p-3 rounded-lg mb-4 text-sm">
                            {success}
                        </div>
                    )}

                    <Button type="submit" className="w-full rounded-lg">
                        Register
                    </Button>
                </form>

                <p className="text-center mt-4 text-gray-600 text-sm">
                    Already have an account?{' '}
                    <Link href="/login" className="underline text-gray-800">
                        Login here
                    </Link>
                </p>

                <p className="text-center mt-4 text-gray-600 text-sm">
                    <Link href="/" className="underline text-gray-800">
                        ← Back to Home
                    </Link>
                </p>
            </div>
        </div>
    );
}
