import Link from 'next/link';
import { fetchBlogs } from '@/lib/api-client';

export const metadata = {
  title: 'Ahmet Kadayıfçı - Portfolio',
  description: 'Personal blog and portfolio showcasing my latest blog posts and projects',
};

export default async function Home() {
  // Fetch blogs on the server
  const allBlogs = await fetchBlogs();
  const blogs = allBlogs.slice(0, 3); // Get last 3 blogs

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      <nav className="desktop-nav sticky top-5 flex justify-between items-center bg-white px-8 py-3 border-2 border-gray-800 rounded-full mb-8">
        <div className="flex gap-8">
          <Link href="/" className="hover:underline font-medium">
            Home
          </Link>
          <a href="#" className="hover:underline">
            About me
          </a>
          <Link href="/blogs" className="hover:underline">
            Blog
          </Link>
          <a href="#" className="hover:underline">
            Projects
          </a>
        </div>
        <a href="#contact" className="flex items-center gap-2 bg-white px-6 py-2 border-2 border-gray-800 rounded-full hover:bg-gray-50">
          <span>Contact</span>
          <span className="text-xs">→</span>
        </a>
      </nav>

      <section className="flex gap-10 p-16 border-2 border-gray-800 rounded-3xl mb-10 items-center">
        <div className="w-52 h-64 border-2 border-gray-800 rounded-2xl overflow-hidden flex-shrink-0">
          <img src="/assets/images/profile-photo.png" alt="Coder Name" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl mb-5 font-normal">Hi there, my name is &quot;Ahmet Kadayıfçı&quot; 👋</h1>
          <p className="text-base text-gray-700 mb-8 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deserunt mollitia dicta sequi dolor
            consequuntur facere ab consequatur, praesentium nobis saepe.
          </p>
          <a href="#details" className="flex items-center gap-2 bg-white px-8 py-3 border-2 border-gray-800 rounded-full hover:bg-gray-50 float-right">
            Details <span className="text-xs">→</span>
          </a>
        </div>
      </section>

      <section className="flex items-center justify-between gap-5 mb-8">
        <div className="flex flex-1 gap-2">
          {blogs.length === 0 ? (
            <p className="text-center text-gray-500 py-10 flex-1">No blogs available yet.</p>
          ) : (
            blogs.map(blog => (
              <article key={blog.id} className="flex-1 border-2 border-gray-800 rounded-2xl p-2">
                <div className="w-full h-24 bg-gray-800 rounded-xl mb-2"></div>
                <Link href={`/blogs/${blog.id}`}>
                  <h3 className="font-medium hover:underline">{blog.title}</h3>
                </Link>
                <p className="text-xs text-gray-500">{formatDate(blog.created_at)}</p>
              </article>
            ))
          )}
        </div>
        <Link href="/blogs" className="text-base hover:underline">
          View all →
        </Link>
      </section>

      <footer className="text-center py-5 border-t-2 border-dotted border-gray-800 text-gray-500 text-sm">
        <p>created by Ahmet Kadayıfçı</p>
      </footer>
    </>
  );
}
