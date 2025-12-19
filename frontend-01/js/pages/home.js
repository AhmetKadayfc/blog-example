// Homepage logic - Load last 3 blogs and handle auth state

document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    loadRecentBlogs();
});

// Setup navigation based on auth state
function setupNavigation() {
    const desktopNav = document.querySelector('.desktop-nav .nav-links');
    const mobileNav = document.querySelector('.mobile-nav');

    // Update blogs link to point to blogs.html
    const blogLinks = document.querySelectorAll('a[href="#"]');
    blogLinks.forEach(link => {
        if (link.textContent.trim() === 'Blog') {
            link.href = 'pages/blogs.html';
        }
    });

    // Add auth links to desktop nav
    if (desktopNav) {
        const existingAuthLinks = desktopNav.querySelector('.auth-links');
        if (!existingAuthLinks) {
            const authLinksDiv = document.createElement('div');
            authLinksDiv.className = 'auth-links';

            if (ApiClient.isAuthenticated()) {
                authLinksDiv.innerHTML = `
                    <a href="pages/create-blog.html">Create Blog</a>
                    <a href="#" id="logoutBtn">Logout</a>
                `;

                // Add logout handler
                setTimeout(() => {
                    const logoutBtn = document.getElementById('logoutBtn');
                    if (logoutBtn) {
                        logoutBtn.addEventListener('click', (e) => {
                            e.preventDefault();
                            ApiClient.auth.logout();
                            window.location.reload();
                        });
                    }
                }, 0);
            } else {
                authLinksDiv.innerHTML = `
                    <a href="pages/login.html">Login</a>
                    <a href="pages/register.html">Register</a>
                `;
            }

            desktopNav.appendChild(authLinksDiv);
        }
    }
}

// Load and display recent blogs
async function loadRecentBlogs() {
    const blogGrid = document.querySelector('.blog-grid');
    if (!blogGrid) return;

    try {
        const response = await ApiClient.blogs.getAll(3);
        const blogs = response || [];

        if (blogs.length === 0) {
            blogGrid.innerHTML = '<p class="no-data">No blogs available yet.</p>';
            return;
        }

        // Clear existing placeholder cards
        blogGrid.innerHTML = '';

        // Create blog cards from API data
        blogs.forEach(blog => {
            const date = new Date(blog.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

            const article = document.createElement('article');
            article.className = 'blog-card';
            article.innerHTML = `
                <div class="blog-image"></div>
                <a href="pages/blog-detail.html?id=${blog.id}"><h3 class="blog-title">${escapeHtml(blog.title)}</h3></a>
                <p class="blog-date">${date}</p>
            `;

            blogGrid.appendChild(article);
        });

        // Update "View all" link
        const viewAllLink = document.querySelector('.view-all');
        if (viewAllLink) {
            viewAllLink.href = 'pages/blogs.html';
        }
    } catch (error) {
        console.error('Failed to load blogs:', error);
        blogGrid.innerHTML = '<p class="error-message">Failed to load blogs.</p>';
    }
}

// Utility: Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
