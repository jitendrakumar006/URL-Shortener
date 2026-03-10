// DOM Elements
const urlInput = document.getElementById('urlInput');
const shortenBtn = document.getElementById('shortenBtn');
const copyBtn = document.getElementById('copyBtn');
const newUrlBtn = document.getElementById('newUrlBtn');
const errorMessage = document.getElementById('errorMessage');
const loadingMessage = document.getElementById('loadingMessage');
const resultSection = document.getElementById('resultSection');
const originalUrlDisplay = document.getElementById('originalUrlDisplay');
const shortUrlDisplay = document.getElementById('shortUrlDisplay');
const shortCodeDisplay = document.getElementById('shortCodeDisplay');

// Event Listeners
shortenBtn.addEventListener('click', shortenURL);
copyBtn.addEventListener('click', copyToClipboard);
newUrlBtn.addEventListener('click', resetForm);
urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        shortenURL();
    }
});

// Shorten URL Function
async function shortenURL() {
    const url = urlInput.value.trim();

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
    shortenBtn.disabled = true;

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
        shortenBtn.disabled = false;
        hideLoading();
    }
}

// Display Result Function
function displayResult(data) {
    originalUrlDisplay.textContent = data.originalUrl;
    shortUrlDisplay.value = data.shortUrl;
    shortCodeDisplay.textContent = data.shortCode;
}

// Validate URL Function
function isValidURL(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch (error) {
        return false;
    }
}

// Copy to Clipboard Function
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

// Reset Form Function
function resetForm() {
    urlInput.value = '';
    urlInput.focus();
    resultSection.style.display = 'none';
    clearMessages();
}

// Show Error Function
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
}

// Show Loading Function
function showLoading(message) {
    loadingMessage.textContent = message;
    loadingMessage.classList.add('show');
}

// Hide Loading Function
function hideLoading() {
    loadingMessage.classList.remove('show');
}

// Clear Messages Function
function clearMessages() {
    errorMessage.classList.remove('show');
    errorMessage.textContent = '';
    hideLoading();
}

// Focus on input on page load
document.addEventListener('DOMContentLoaded', () => {
    urlInput.focus();
});
