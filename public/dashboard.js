// DOM Elements
const urlInput = document.getElementById('urlInput');
const shortenBtn = document.getElementById('shortenBtn');
const logoutBtn = document.getElementById('logoutBtn');
const errorMessage = document.getElementById('errorMessage');
const loadingMessage = document.getElementById('loadingMessage');
const urlsList = document.getElementById('urlsList');
const searchInput = document.getElementById('searchInput');
const userDisplay = document.getElementById('userDisplay');
const urlCardTemplate = document.getElementById('urlCardTemplate');
const totalUrlsSpan = document.getElementById('totalUrls');
const totalClicksSpan = document.getElementById('totalClicks');

let allUrls = [];
let token = localStorage.getItem('token');
let currentUser = JSON.parse(localStorage.getItem('user'));

// Event Listeners
shortenBtn.addEventListener('click', shortenURL);
logoutBtn.addEventListener('click', logout);
searchInput.addEventListener('input', filterUrls);
urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        shortenURL();
    }
});

// Initialize Dashboard
window.addEventListener('DOMContentLoaded', () => {
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    displayUserInfo();
    loadUserUrls();
});

// Display User Info
function displayUserInfo() {
    if (currentUser) {
        userDisplay.textContent = `Welcome, ${currentUser.username}!`;
    }
}

// Load User URLs
async function loadUserUrls() {
    try {
        const response = await fetch('/api/user/urls', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'login.html';
            return;
        }

        const data = await response.json();

        if (data.success) {
            allUrls = data.urls;
            displayUrls(allUrls);
            updateStats();
        }
    } catch (error) {
        console.error('Error loading URLs:', error);
    }
}

// Display URLs
function displayUrls(urls) {
    urlsList.innerHTML = '';

    if (urls.length === 0) {
        urlsList.innerHTML = '<p class="no-urls">No short URLs created yet. Create one above!</p>';
        return;
    }

    urls.forEach((url) => {
        const card = urlCardTemplate.content.cloneNode(true);

        // Set values
        card.querySelector('.code-value').textContent = url.shortCode;
        card.querySelector('.original-url').textContent = url.originalUrl;
        card.querySelector('.clicks-count').textContent = url.clicks;
        card.querySelector('.created-date').textContent = formatDate(url.createdAt);
        card.querySelector('.short-url-input').value = url.shortUrl;

        // Add event listeners
        const copyBtn = card.querySelector('.btn-copy');
        const deleteBtn = card.querySelector('.btn-delete');
        const openBtn = card.querySelector('.btn-open');

        copyBtn.addEventListener('click', () => copyToClipboard(url.shortUrl, copyBtn));
        deleteBtn.addEventListener('click', () => deleteUrl(url.shortCode));
        openBtn.addEventListener('click', () => window.open(url.shortUrl, '_blank'));

        urlsList.appendChild(card);
    });
}

// Filter URLs
function filterUrls() {
    const query = searchInput.value.toLowerCase();
    const filtered = allUrls.filter(
        (url) =>
            url.originalUrl.toLowerCase().includes(query) ||
            url.shortCode.toLowerCase().includes(query)
    );
    displayUrls(filtered);
}

// Shorten URL
async function shortenURL() {
    const url = urlInput.value.trim();

    clearMessages();

    if (!url) {
        showError('Please enter a URL');
        return;
    }

    if (!isValidURL(url)) {
        showError('Please enter a valid URL (must start with http:// or https://)');
        return;
    }

    showLoading('Generating short link...');
    shortenBtn.disabled = true;

    try {
        const response = await fetch('/api/shorten', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ originalUrl: url }),
        });

        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'login.html';
            return;
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to shorten URL');
        }

        // Clear input
        urlInput.value = '';
        urlInput.focus();

        // Reload URLs
        loadUserUrls();
    } catch (error) {
        showError(error.message || 'An error occurred. Please try again.');
        console.error('Error:', error);
    } finally {
        shortenBtn.disabled = false;
        hideLoading();
    }
}

// Copy to Clipboard
async function copyToClipboard(text, button) {
    try {
        await navigator.clipboard.writeText(text);
        const originalText = button.textContent;
        button.textContent = '✅ Copied!';

        setTimeout(() => {
            button.textContent = originalText;
        }, 2000);
    } catch (error) {
        showError('Failed to copy to clipboard');
        console.error('Error:', error);
    }
}

// Delete URL
async function deleteUrl(shortCode) {
    if (!confirm('Are you sure you want to delete this short URL?')) {
        return;
    }

    try {
        const response = await fetch(`/api/url/${shortCode}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'login.html';
            return;
        }

        const data = await response.json();

        if (data.success) {
            loadUserUrls();
        } else {
            showError(data.message || 'Failed to delete URL');
        }
    } catch (error) {
        showError(error.message || 'An error occurred');
        console.error('Error:', error);
    }
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

// Format Date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

// Update Stats
function updateStats() {
    const totalUrls = allUrls.length;
    const totalClicks = allUrls.reduce((sum, url) => sum + url.clicks, 0);

    totalUrlsSpan.textContent = totalUrls;
    totalClicksSpan.textContent = totalClicks;
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

// Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}
