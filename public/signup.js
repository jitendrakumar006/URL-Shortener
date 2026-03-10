// DOM Elements
const signupForm = document.getElementById('signupForm');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const errorMessage = document.getElementById('errorMessage');
const loadingMessage = document.getElementById('loadingMessage');

// Event Listeners
signupForm.addEventListener('submit', handleSignup);

// Handle Signup
async function handleSignup(e) {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Clear previous messages
    clearMessages();

    // Validate inputs
    if (!username || !email || !password || !confirmPassword) {
        showError('All fields are required');
        return;
    }

    if (username.length < 3) {
        showError('Username must be at least 3 characters long');
        return;
    }

    if (username.length > 30) {
        showError('Username cannot exceed 30 characters');
        return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        showError('Username can only contain letters, numbers, hyphens, and underscores');
        return;
    }

    if (!/^[\w.-]+@[\w.-]+\.\w+$/.test(email)) {
        showError('Please enter a valid email address');
        return;
    }

    if (password.length < 6) {
        showError('Password must be at least 6 characters long');
        return;
    }

    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }

    // Show loading
    showLoading('Creating your account...');
    signupForm.querySelector('.btn-submit').disabled = true;

    try {
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                email,
                password,
                confirmPassword,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Signup failed');
        }

        // Save token to localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    } catch (error) {
        showError(error.message || 'An error occurred. Please try again.');
        console.error('Error:', error);
    } finally {
        hideLoading();
        signupForm.querySelector('.btn-submit').disabled = false;
    }
}

// Show Error
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
}

// Show Loading
function showLoading(message) {
    loadingMessage.textContent = message;
    loadingMessage.classList.add('show');
}

// Hide Loading
function hideLoading() {
    loadingMessage.classList.remove('show');
}

// Clear Messages
function clearMessages() {
    errorMessage.classList.remove('show');
    errorMessage.textContent = '';
    hideLoading();
}

// Check if already logged in
window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = 'dashboard.html';
    }
    usernameInput.focus();
});
