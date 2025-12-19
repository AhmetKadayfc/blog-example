'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import ApiClient from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function CreateBlogPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!ApiClient.isAuthenticated()) {
            alert('You must be logged in to access this page.');
            router.push('/login');
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!title.trim() || !content.trim()) {
            setError('Please fill in all required fields.');
            return;
        }

        const blogData = {
            title: title.trim(),
            content: content.trim(),
            status: isActive ? 'active' : 'inactive'
        };

        try {
            await ApiClient.blogs.create(blogData);
            router.push('/blogs');
        } catch (err: any) {
            setError(`Failed to save blog: ${err.message}`);
        }
    };

    return (
        <>
            <Navbar />
            <main className="max-w-6xl mx-auto px-5">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-3xl mb-8">Create New Blog</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-5">
                            <Label htmlFor="title" className="block mb-2 font-medium text-gray-700">
                                Title *
                            </Label>
                            <Input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="border-2 border-gray-800 rounded-lg"
                            />
                        </div>

                        <div className="mb-5">
                            <Label htmlFor="content" className="block mb-2 font-medium text-gray-700">
                                Content *
                            </Label>
                            <Textarea
                                id="content"
                                rows={10}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                className="border-2 border-gray-800 rounded-lg resize-y min-h-[150px]"
                            />
                        </div>

                        <div className="mb-5 flex items-center">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                    className="mr-2 w-5 h-5 cursor-pointer"
                                />
                                <span className="font-medium text-gray-700">Active</span>
                            </label>
                        </div>

                        {error && (
                            <div className="text-red-600 bg-red-50 p-3 rounded-lg mb-4 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="flex gap-4 mt-8">
                            <Button type="submit" className="rounded-lg">
                                Create Blog
                            </Button>
                            <Link href="/blogs" className="inline-flex items-center px-6 py-2 border-2 border-gray-800 rounded-lg hover:bg-gray-50">
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
}
