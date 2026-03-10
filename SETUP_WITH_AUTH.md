# Complete Setup Guide with Authentication

## What's New in This Update

This updated version includes **full user authentication** with the following features:

✅ **User Registration** - Sign up with username, email, and password  
✅ **User Login** - Secure login with JWT tokens  
✅ **Personal Dashboard** - Manage all your shortened URLs  
✅ **Click Analytics** - Track how many times each short link is visited  
✅ **URL Management** - Edit, delete, and search your URLs  
✅ **Secure Storage** - Passwords hashed with bcryptjs  
✅ **Session Management** - 30-day token expiration  

## Installation Steps

### 1. Prerequisites

Make sure you have installed:
- **Node.js v14+** from https://nodejs.org/
- **MongoDB Atlas Account** from https://www.mongodb.com/cloud/atlas

### 2. Project Setup

```bash
# Navigate to project directory
cd URL-Shortener

# Install all dependencies
npm install

# This installs:
# - Express.js (web framework)
# - Mongoose (MongoDB library)
# - bcryptjs (password hashing)
# - jsonwebtoken (JWT authentication)
# - cors (cross-origin requests)
# - dotenv (environment variables)
# - shortid (short code generation)
# - nodemon (dev auto-reload)
```

### 3. MongoDB Atlas Setup

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up or log in
3. Create a new project
4. Create a new cluster (use free tier)
5. Create a database user:
   - Click "Database Access"
   - Add a new database user
   - Set username and password
   - Note these credentials

6. Get connection string:
   - Click "Clusters" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`

7. Whitelist your IP:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Add `0.0.0.0/0` (or your specific IP)

### 4. Environment Configuration

Create `.env` file in root directory:

```env
# Database Connection
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/url-shortener?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development

# Authentication Secret
JWT_SECRET=your-secret-key-change-this-to-random-string-min-32-chars
```

**Example .env file:**
```env
MONGODB_URI=mongodb+srv://john:password123@cluster0.mongodb.net/url-shortener?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
JWT_SECRET=aB9kL2mN5pQ8rS1tU4vW7xY3zC6dE0fG9hI2jK5lM8nO1pQ4rS7tU0vW3xY6zC9d
```

### 5. Start the Application

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

**Expected output:**
```
Server is running on port 5000
Visit http://localhost:5000 to access the application
MongoDB Connected: cluster0.mongodb.net
```

## Using the Application

### First Time Users

1. Open http://localhost:5000
2. Click **"Sign Up"**
3. Fill in the registration form:
   - **Username**: Choose a unique username (3-30 characters)
   - **Email**: Your email address
   - **Password**: At least 6 characters
   - **Confirm Password**: Repeat your password
4. Click **"Create Account"**
5. You'll be logged in automatically

### Registered Users

1. Open http://localhost:5000
2. Click **"Login"**
3. Enter your email and password
4. Click **"Login"**
5. You'll be taken to your personal **Dashboard**

### Dashboard Features

#### Creating a Short URL
1. Paste your long URL in the input field
2. Click **"Generate Short Link"**
3. Your short URL will appear in the dashboard
4. Click **"📋 Copy"** to copy to clipboard

#### Managing Your URLs
- **View**: All your created URLs listed in one place
- **Search**: Use the search bar to find specific URLs
- **Copy**: Copy any short link with one click
- **Open**: Click **"🔗 Open"** to test the short link
- **Delete**: Remove URLs you no longer need
- **Analytics**: See click count and creation date

#### Dashboard Statistics
- **Total URLs**: Count of all your shortened URLs
- **Total Clicks**: Combined clicks across all URLs

### Guest Shortening

On the home page, guests can:
- Create temporary short links without an account
- View the generated short URL
- Copy the link to clipboard

**Limitation**: Guest links are not saved to any account.

## Testing the Application

### Test Signup
```
Username: testuser
Email: test@example.com
Password: password123
```

### Test Login
```
Email: test@example.com
Password: password123
```

### Test URL Shortening
Try these URLs:
- https://www.example.com/path/to/page
- https://github.com/some/repository
- https://www.wikipedia.org/wiki/URL
- https://nodejs.org/en/docs/

### Test Dashboard Features
1. Create multiple URLs
2. Copy a short link and share it
3. Click a short link to test redirect
4. Delete a URL
5. Search for URLs
6. Logout and login again

## File Structure

```
URL-Shortener/
├── config/
│   └── db.js                 # MongoDB connection
├── middleware/
│   └── auth.js               # JWT authentication middleware
├── models/
│   ├── URLModel.js           # URL database schema
│   └── User.js               # User database schema
├── routes/
│   ├── auth.js               # Authentication routes (signup/login)
│   └── routes.js             # URL shortening routes
├── public/
│   ├── index.html            # Home page
│   ├── login.html            # Login page
│   ├── signup.html           # Signup page
│   ├── dashboard.html        # User dashboard
│   ├── index.js              # Home page scripts
│   ├── login.js              # Login logic
│   ├── signup.js             # Signup logic
│   ├── dashboard.js          # Dashboard logic
│   ├── style.css             # Home page styles
│   ├── auth.css              # Auth pages styles
│   └── dashboard.css         # Dashboard styles
├── server.js                 # Main Express app
├── package.json              # Dependencies
├── .env                      # Environment variables (CREATE THIS)
├── .env.example              # Example environment
└── README.md                 # Documentation
```

## API Endpoints

### Public Endpoints
- `GET /` - Home page
- `POST /api/shorten` - Create short URL (guest or authenticated)
- `GET /s/:shortCode` - Redirect to original URL

### Authentication Endpoints
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Protected Endpoints (Require Authentication)
- `GET /api/user/urls` - Get user's URLs
- `DELETE /api/url/:shortCode` - Delete a URL
- `GET /api/analytics/:shortCode` - Get URL analytics

## Common Issues

### "Cannot find module" Error
```bash
# Solution: Install dependencies
npm install
```

### MongoDB Connection Error
- Check MONGODB_URI is correct in .env
- Verify username and password
- Whitelist your IP in MongoDB Atlas Network Access
- Check internet connection

### Port Already in Use
```bash
# Solution 1: Use different port
PORT=3000 npm start

# Solution 2: Kill process using port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti :5000 | xargs kill -9
```

### CORS Errors
- Ensure CORS middleware is enabled in server.js
- Check frontend is making requests to correct backend URL

### Authentication Token Issues
- Clear localStorage: Open DevTools → Application → Clear All
- Logout and login again
- Restart the application

### MongoDB Schema Errors
- Delete and recreate MongoDB database
- Check all required fields are provided
- Verify data types match schema

## Deployment Options

For deploying to production, see [DEPLOYMENT.md](DEPLOYMENT.md)

Quick deployment to Heroku:
```bash
# Install Heroku CLI
# Login: heroku login
# Create app: heroku create app-name
# Set env: heroku config:set MONGODB_URI=...
# Deploy: git push heroku main
```

## Security Checklist

✅ **Development:**
- [ ] JWT_SECRET is random and strong
- [ ] .env file is in .gitignore
- [ ] Dependencies are up-to-date
- [ ] No console.logs with sensitive data

✅ **Production:**
- [ ] Enable HTTPS/SSL
- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Add rate limiting
- [ ] Enable database backups
- [ ] Monitor server logs
- [ ] Update dependencies regularly
- [ ] Use environment variables for secrets

## Next Steps

1. **Customize**: Edit the styling and customize branding
2. **Deploy**: Push to production (see DEPLOYMENT.md)
3. **Scale**: Add more features and analytics
4. **Monitor**: Set up logging and error tracking

## Support & Documentation

📖 **Complete Docs**: [README.md](README.md)  
🔐 **Auth Guide**: [AUTHENTICATION.md](AUTHENTICATION.md)  
⚡ **Quick Start**: [QUICK_START.md](QUICK_START.md)  
🚀 **Deployment**: [DEPLOYMENT.md](DEPLOYMENT.md)

## Have Questions?

Check the documentation files or review the code comments for more details.

---

**Happy URL Shortening! 🎉**
