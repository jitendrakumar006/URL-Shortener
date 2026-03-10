// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('errorMessage');
const loadingMessage = document.getElementById('loadingMessage');

// Event Listeners
loginForm.addEventListener('submit', handleLogin);

// Handle Login
async function handleLogin(e) {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Clear previous messages
    clearMessages();

    // Validate inputs
    if (!email || !password) {
        showError('Email and password are required');
        return;
    }

    if (!/^[\w.-]+@[\w.-]+\.\w+$/.test(email)) {
        showError('Please enter a valid email address');
        return;
    }

    // Show loading
    showLoading('Logging in...');
    loginForm.querySelector('.btn-submit').disabled = true;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
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
        loginForm.querySelector('.btn-submit').disabled = false;
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
    emailInput.focus();
});
