'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BlogActions } from '@/components/blog-actions';
import ApiClient, { Blog } from '@/lib/api-client';

interface BlogListClientProps {
    blogs: Blog[];
}

export function BlogListClient({ blogs }: BlogListClientProps) {
    const [blogList, setBlogList] = useState(blogs);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Get user ID from localStorage on client side
        setCurrentUserId(ApiClient.getUserId());
    }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this blog?')) {
            try {
                await ApiClient.blogs.delete(id.toString());
                // Refresh the page to get updated data from server
                router.refresh();
            } catch (err: any) {
                alert(`Failed to delete blog: ${err.message}`);
            }
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const truncate = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const isOwner = (blog: Blog) => {
        return currentUserId && String(blog.author.id) === String(currentUserId);
    };

    return (
        <div className="flex flex-col gap-5">
            {blogList.length === 0 ? (
                <p className="text-center text-gray-500 py-10">No blogs found.</p>
            ) : (
                blogList.map(blog => (
                    <article key={blog.id} className="flex justify-between items-start gap-5 border-2 border-gray-800 rounded-2xl p-5">
                        <div className="flex-1">
                            <a href={`/blogs/${blog.id}`} className="no-underline">
                                <h2 className="text-xl font-medium mb-2 hover:text-gray-600 transition-colors cursor-pointer">
                                    {blog.title}
                                </h2>
                            </a>
                            <p className="text-sm text-gray-500 mb-2">{formatDate(blog.created_at)}</p>
                            <p className="text-gray-700 leading-relaxed mb-2">{truncate(blog.content, 150)}</p>
                            <span className={`inline-block px-3 py-1 rounded-xl text-xs font-medium ${blog.status === 'active'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                                }`}>
                                {blog.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <BlogActions
                            blogId={blog.id}
                            isOwner={!!isOwner(blog)}
                            onDelete={() => handleDelete(blog.id)}
                        />
                    </article>
                ))
            )}
        </div>
    );
}
