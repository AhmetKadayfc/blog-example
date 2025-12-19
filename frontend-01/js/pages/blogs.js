// Blogs listing page logic

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    initAuthNav();
    loadBlogs();
});

// Setup auth navigation
function initAuthNav() {
    const authNav = document.getElementById('authNav');
    const createBlogBtn = document.getElementById('createBlogBtn');

    if (ApiClient.isAuthenticated()) {
        authNav.innerHTML = `
            <a href="create-blog.html">Create Blog</a>
            <a href="#" id="logoutBtn">Logout</a>
        `;
        createBlogBtn.style.display = 'inline-block';
        createBlogBtn.addEventListener('click', () => {
            window.location.href = 'create-blog.html';
        });

        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            ApiClient.auth.logout();
            window.location.reload();
        });
    } else {
        authNav.innerHTML = `
            <a href="login.html">Login</a>
            <a href="register.html">Register</a>
        `;
    }
}

// Load all blogs
async function loadBlogs() {
    const container = document.getElementById('blogsContainer');

    try {
        const response = await ApiClient.blogs.getAll();
        console.log('API Response:', response);
        const blogs = response || [];
        if (blogs.length === 0) {
            container.innerHTML = '<p class="no-data">No blogs found.</p>';
            return;
        }

        container.innerHTML = blogs.map(blog => createBlogCard(blog)).join('');

        // Add event listeners for delete and edit buttons
        if (ApiClient.isAuthenticated()) {
            attachBlogActions();
        }
    } catch (error) {
        container.innerHTML = `<p class="error-message">Failed to load blogs: ${error.message}</p>`;
    }
}

// Create blog card HTML
function createBlogCard(blog) {
    const isAuthenticated = ApiClient.isAuthenticated();
    const currentUserId = ApiClient.getUserId();
    const isOwner = isAuthenticated && currentUserId && String(blog.author.id) === String(currentUserId);

    const date = new Date(blog.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return `
        <article class="blog-item">
            <div class="blog-item-content">
                <a href="blog-detail.html?id=${blog.id}" style="text-decoration: none; color: inherit;">
                    <h2 class="blog-item-title">${escapeHtml(blog.title)}</h2>
                </a>
                <p class="blog-item-date">${date}</p>
                <p class="blog-item-excerpt">${escapeHtml(truncate(blog.content, 150))}</p>
                <span class="blog-status ${blog.status}">
                    ${blog.status === 'active' ? 'Active' : 'Inactive'}
                </span>
            </div>
            ${isOwner ? `
                <div class="blog-item-actions">
                    <button class="btn-edit" data-id="${blog.id}">Edit</button>
                    <button class="btn-delete" data-id="${blog.id}">Delete</button>
                </div>
            ` : ''}
        </article>
    `;
}

// Attach event listeners to blog action buttons
function attachBlogActions() {
    // Edit buttons
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => {
            const blogId = btn.getAttribute('data-id');
            window.location.href = `edit-blog.html?id=${blogId}`;
        });
    });

    // Delete buttons
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', async () => {
            const blogId = btn.getAttribute('data-id');
            if (confirm('Are you sure you want to delete this blog?')) {
                await deleteBlog(blogId);
            }
        });
    });
}

// Delete blog
async function deleteBlog(id) {
    try {
        await ApiClient.blogs.delete(id);
        // Reload blogs after successful deletion
        loadBlogs();
    } catch (error) {
        alert(`Failed to delete blog: ${error.message}`);
    }
}

// Utility: Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Utility: Truncate text
function truncate(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}
