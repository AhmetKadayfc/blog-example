import { notFound } from 'next/navigation';
import Navbar from '@/components/navbar';
import { BlogDetailActions } from '@/components/blog-detail-actions';
import { fetchBlogById } from '@/lib/api-client';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const blog = await fetchBlogById(id);

    if (!blog) {
        return {
            title: 'Blog Not Found',
        };
    }

    return {
        title: `${blog.title} - Blog App`,
        description: blog.content.substring(0, 155),
    };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const blog = await fetchBlogById(id);

    if (!blog) {
        notFound();
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <>
            <Navbar />
            <main className="max-w-6xl mx-auto px-5">
                <div className="max-w-4xl mx-auto py-10">
                    <header className="mb-10 pb-8 border-b-2 border-gray-200">
                        <h1 className="text-4xl font-medium mb-5 leading-tight">{blog.title}</h1>
                        <div className="flex gap-5 items-center flex-wrap">
                            <p className="text-gray-700 font-medium">
                                By {blog.author.first_name} {blog.author.last_name}
                            </p>
                            <p className="text-sm text-gray-500">{formatDate(blog.created_at)}</p>
                            <span className={`inline-block px-3 py-1 rounded-xl text-xs font-medium ${blog.status === 'active'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                                }`}>
                                {blog.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </header>
                    <div className="text-base leading-relaxed text-gray-800 mb-10">
                        {blog.content.split('\n').map((paragraph, idx) => (
                            <p key={idx} className="mb-4">{paragraph}</p>
                        ))}
                    </div>

                    <BlogDetailActions blogId={id} authorId={blog.author.id} />
                </div>
            </main>
        </>
    );
}
