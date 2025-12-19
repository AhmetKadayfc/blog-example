// Blog form logic for create and edit pages

// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    if (!ApiClient.isAuthenticated()) {
        alert('You must be logged in to access this page.');
        window.location.href = 'login.html';
        return;
    }

    // Setup logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            ApiClient.auth.logout();
            window.location.href = '../index.html';
        });
    }

    // Determine if this is edit or create mode
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');

    if (blogId) {
        // Edit mode
        loadBlogData(blogId);
    } else {
        // Create mode - form is already visible in create-blog.html
    }

    // Setup form submission
    setupFormSubmit(blogId);
});

// Load existing blog data for editing
async function loadBlogData(blogId) {
    const loadingMessage = document.getElementById('loadingMessage');
    const form = document.getElementById('blogForm');
    const errorMessage = document.getElementById('errorMessage');

    try {
        const blog = await ApiClient.blogs.getById(blogId);

        // Populate form fields
        document.getElementById('title').value = blog.title;
        document.getElementById('content').value = blog.content;
        document.getElementById('isActive').checked = blog.status === 'active';

        // Show form, hide loading
        loadingMessage.style.display = 'none';
        form.style.display = 'block';
    } catch (error) {
        loadingMessage.style.display = 'none';
        errorMessage.textContent = `Failed to load blog: ${error.message}`;
        errorMessage.style.display = 'block';
    }
}

// Setup form submission handler
function setupFormSubmit(blogId) {
    const form = document.getElementById('blogForm');
    const errorMessage = document.getElementById('errorMessage');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.textContent = '';

        const title = document.getElementById('title').value.trim();
        const content = document.getElementById('content').value.trim();
        const isActive = document.getElementById('isActive').checked ? 'active' : 'inactive';

        if (!title || !content) {
            errorMessage.textContent = 'Please fill in all required fields.';
            return;
        }

        const blogData = {
            title,
            content,
            status: isActive
        };

        try {
            if (blogId) {
                // Update existing blog
                await ApiClient.blogs.update(blogId, blogData);
            } else {
                // Create new blog
                await ApiClient.blogs.create(blogData);
            }

            // Redirect to blogs page on success
            window.location.href = 'blogs.html';
        } catch (error) {
            errorMessage.textContent = `Failed to save blog: ${error.message}`;
        }
    });
}
