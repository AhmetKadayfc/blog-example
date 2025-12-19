// Authentication logic for login and register pages

// Handle login
if (document.getElementById('loginForm')) {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.textContent = '';

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            await ApiClient.auth.login(email, password);
            // Redirect to homepage on success
            window.location.href = '../index.html';
        } catch (error) {
            errorMessage.textContent = error.message || 'Login failed. Please try again.';
        }
    });
}

// Handle registration
if (document.getElementById('registerForm')) {
    const registerForm = document.getElementById('registerForm');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.textContent = '';
        successMessage.textContent = '';

        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            await ApiClient.auth.register(email, password, firstName, lastName);
            successMessage.textContent = 'Registration successful! Redirecting to login...';

            // Redirect to login page after 2 seconds
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } catch (error) {
            errorMessage.textContent = error.message || 'Registration failed. Please try again.';
        }
    });
}
