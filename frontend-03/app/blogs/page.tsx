import Navbar from '@/components/navbar';
import { BlogListClient } from '@/components/blog-list-client';
import { CreateBlogButton } from '@/components/create-blog-button';
import { fetchBlogs } from '@/lib/api-client';

export const metadata = {
    title: 'All Blogs - Blog App',
    description: 'Browse all blog posts',
};

export default async function BlogsPage() {
    // Fetch blogs on the server
    const blogs = await fetchBlogs();

    return (
        <>
            <Navbar />
            <main className="max-w-6xl mx-auto px-5">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-normal">All Blogs</h1>
                    <CreateBlogButton />
                </div>

                <BlogListClient blogs={blogs} />
            </main>
        </>
    );
}
