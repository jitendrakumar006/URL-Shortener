// DOM Elements
const guestUrlInput = document.getElementById('guestUrlInput');
const guestShortenBtn = document.getElementById('guestShortenBtn');
const copyBtn = document.getElementById('copyBtn');
const newUrlBtn = document.getElementById('newUrlBtn');
const guestErrorMessage = document.getElementById('guestErrorMessage');
const guestLoadingMessage = document.getElementById('guestLoadingMessage');
const resultSection = document.getElementById('resultSection');
const originalUrlDisplay = document.getElementById('originalUrlDisplay');
const shortUrlDisplay = document.getElementById('shortUrlDisplay');
const shortCodeDisplay = document.getElementById('shortCodeDisplay');
const authButtons = document.getElementById('authButtons');
const userSection = document.getElementById('userSection');
const dashboardBtn = document.getElementById('dashboardBtn');
const quickLogoutBtn = document.getElementById('quickLogoutBtn');

// Event Listeners
guestShortenBtn.addEventListener('click', shortenURL);
copyBtn.addEventListener('click', copyToClipboard);
newUrlBtn.addEventListener('click', resetForm);
dashboardBtn.addEventListener('click', () => (window.location.href = 'dashboard.html'));
quickLogoutBtn.addEventListener('click', logout);
guestUrlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        shortenURL();
    }
});

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (token && user) {
        // User is logged in
        authButtons.style.display = 'none';
        userSection.style.display = 'flex';
    } else {
        // User is not logged in
        authButtons.style.display = 'flex';
        userSection.style.display = 'none';
    }

    guestUrlInput.focus();
});

// Shorten URL (Guest)
async function shortenURL() {
    const url = guestUrlInput.value.trim();

    // Clear previous messages
    clearMessages();

    // Validate URL
    if (!url) {
        showError('Please enter a URL');
        return;
    }

    if (!isValidURL(url)) {
        showError('Please enter a valid URL (must start with http:// or https://)');
        return;
    }

    // Show loading
    showLoading('Generating short link...');
    guestShortenBtn.disabled = true;

    try {
        const response = await fetch('/api/shorten', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ originalUrl: url }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to shorten URL');
        }

        // Display result
        displayResult(data);
        resultSection.style.display = 'block';
    } catch (error) {
        showError(error.message || 'An error occurred. Please try again.');
        console.error('Error:', error);
    } finally {
        guestShortenBtn.disabled = false;
        hideLoading();
    }
}

// Display Result
function displayResult(data) {
    originalUrlDisplay.textContent = data.originalUrl;
    shortUrlDisplay.value = data.shortUrl;
    shortCodeDisplay.textContent = data.shortCode;
    guestUrlInput.focus();
}

// Validate URL
function isValidURL(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch (error) {
        return false;
    }
}

// Copy to Clipboard
async function copyToClipboard() {
    const shortUrl = shortUrlDisplay.value;

    try {
        await navigator.clipboard.writeText(shortUrl);

        // Change button text temporarily
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ Copied!';

        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    } catch (error) {
        showError('Failed to copy to clipboard');
        console.error('Error:', error);
    }
}

// Reset Form
function resetForm() {
    guestUrlInput.value = '';
    guestUrlInput.focus();
    resultSection.style.display = 'none';
    clearMessages();
}

// Show Error
function showError(message) {
    guestErrorMessage.textContent = message;
    guestErrorMessage.classList.add('show');
}

// Show Loading
function showLoading(message) {
    guestLoadingMessage.textContent = message;
    guestLoadingMessage.classList.add('show');
}

// Hide Loading
function hideLoading() {
    guestLoadingMessage.classList.remove('show');
}

// Clear Messages
function clearMessages() {
    guestErrorMessage.classList.remove('show');
    guestErrorMessage.textContent = '';
    hideLoading();
}

// Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    location.reload();
}
