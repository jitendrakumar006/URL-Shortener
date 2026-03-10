const express = require('express');
const jwt = require('jsonwebtoken');
const URL = require('../models/URLModel');
const User = require('../models/User');
const shortid = require('shortid');
const protect = require('../middleware/auth');

const router = express.Router();

// Helper function to get user from token
const getUserFromToken = (req) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
    return decoded.id;
  } catch (error) {
    return null;
  }
};

// Route to create a short URL (Protected)
router.post('/api/shorten', protect, async (req, res) => {
  try {
    const { originalUrl } = req.body;
    const userId = req.user.id;

    if (!originalUrl) {
      return res.status(400).json({ message: 'Please provide a URL' });
    }

    // Validate URL format
    const urlRegex = /^(http|https):\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/;
    if (!urlRegex.test(originalUrl)) {
      return res.status(400).json({ message: 'Please provide a valid URL' });
    }

    // Check if URL already exists for this user
    let url = await URL.findOne({ originalUrl, userId });

    if (url) {
      return res.status(200).json({
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        shortUrl: `${req.protocol}://${req.get('host')}/s/${url.shortCode}`,
      });
    }

    // Create new URL entry
    const shortCode = shortid.generate();
    url = new URL({
      originalUrl,
      shortCode,
      userId,
    });

    await url.save();

    // Update user's created URL count
    await User.findByIdAndUpdate(userId, { $inc: { createdUrls: 1 } });

    res.status(201).json({
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      shortUrl: `${req.protocol}://${req.get('host')}/s/${url.shortCode}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to redirect to original URL
router.get('/s/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await URL.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({ message: 'Short URL not found' });
    }

    // Increment click count
    url.clicks += 1;
    await url.save();

    // Redirect to original URL
    res.redirect(url.originalUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to get analytics
router.get('/api/analytics/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await URL.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({ message: 'Short URL not found' });
    }

    res.status(200).json({
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      clicks: url.clicks,
      createdAt: url.createdAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to get user's URLs (Protected)
router.get('/api/user/urls', protect, async (req, res) => {
  try {
    const userId = req.user.id;

    const urls = await URL.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: urls.length,
      urls: urls.map((url) => ({
        shortCode: url.shortCode,
        originalUrl: url.originalUrl,
        shortUrl: `${req.protocol}://${req.get('host')}/s/${url.shortCode}`,
        clicks: url.clicks,
        createdAt: url.createdAt,
        _id: url._id,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to delete a short URL (Protected)
router.delete('/api/url/:shortCode', protect, async (req, res) => {
  try {
    const { shortCode } = req.params;
    const userId = req.user.id;

    const url = await URL.findOneAndDelete({ shortCode, userId });

    if (!url) {
      return res.status(404).json({ message: 'Short URL not found' });
    }

    // Update user's created URL count
    await User.findByIdAndUpdate(userId, { $inc: { createdUrls: -1 } });

    res.status(200).json({
      success: true,
      message: 'Short URL deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
