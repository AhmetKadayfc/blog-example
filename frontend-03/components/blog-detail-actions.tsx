'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ApiClient from '@/lib/api-client';
import { Button } from '@/components/ui/button';

interface BlogDetailActionsProps {
    blogId: string;
    authorId: number;
}

export function BlogDetailActions({ blogId, authorId }: BlogDetailActionsProps) {
    const router = useRouter();
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        const userId = ApiClient.getUserId();
        setIsOwner(userId !== null && String(authorId) === String(userId));
    }, [authorId]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this blog?')) {
            try {
                await ApiClient.blogs.delete(blogId);
                alert('Blog deleted successfully!');
                router.push('/blogs');
            } catch (err: any) {
                alert(`Failed to delete blog: ${err.message}`);
            }
        }
    };

    if (!isOwner) {
        return (
            <div className="pt-5">
                <Link href="/blogs" className="inline-block px-6 py-3 border-2 border-gray-800 rounded-lg hover:bg-gray-50">
                    ← Back to All Blogs
                </Link>
            </div>
        );
    }

    return (
        <>
            <div className="flex gap-4 mb-8 pt-8 border-t-2 border-gray-200">
                <Button
                    onClick={() => router.push(`/edit/${blogId}`)}
                    className="rounded-lg"
                >
                    Edit Blog
                </Button>
                <Button
                    onClick={handleDelete}
                    variant="outline"
                    className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded-lg"
                >
                    Delete Blog
                </Button>
            </div>

            <div className="pt-5">
                <Link href="/blogs" className="inline-block px-6 py-3 border-2 border-gray-800 rounded-lg hover:bg-gray-50">
                    ← Back to All Blogs
                </Link>
            </div>
        </>
    );
}
