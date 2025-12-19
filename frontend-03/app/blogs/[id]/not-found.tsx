import Link from 'next/link';

export const metadata = {
    title: 'Page Not Found - Blog App',
    description: 'The page you are looking for does not exist',
};

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center px-5">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                <h2 className="text-2xl font-medium text-gray-700 mb-6">Blog Not Found</h2>
                <p className="text-gray-600 mb-8">
                    The blog post you're looking for doesn't exist or has been removed.
                </p>
                <Link
                    href="/blogs"
                    className="inline-block px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                    ← Back to All Blogs
                </Link>
            </div>
        </div>
    );
}
