'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ApiClient from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export default function Navbar() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        setIsAuthenticated(ApiClient.isAuthenticated());
    }, []);

    const handleLogout = async () => {
        await ApiClient.auth.logout();
        setIsAuthenticated(false);
        router.push('/');
    };

    return (
        <nav className="sticky top-5 flex justify-between items-center bg-white px-8 py-3 border-2 border-gray-800 rounded-full mb-8">
            <Link href="/" className="text-xl font-bold hover:underline">
                Blog
            </Link>
            <div className="flex gap-5">
                <Link href="/" className="hover:underline">
                    Home
                </Link>
                <Link href="/blogs" className="hover:underline">
                    All Blogs
                </Link>
                {isAuthenticated ? (
                    <>
                        <Link href="/create" className="hover:underline">
                            Create Blog
                        </Link>
                        <button onClick={handleLogout} className="hover:underline">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link href="/login" className="hover:underline">
                            Login
                        </Link>
                        <Link href="/register" className="hover:underline">
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}
