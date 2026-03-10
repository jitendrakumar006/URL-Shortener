# Quick Start Guide

## Setup in 5 Minutes ⚡

### Step 1: Navigate to Project
```bash
cd URL-Shortener
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Create MongoDB Atlas Database
1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Create a new cluster (free tier available)
4. Create a database user with username/password
5. Get your connection string from "Connect" button

### Step 4: Setup Environment File
Create `.env` file in root directory:
```
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/url-shortener?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here_change_in_production
```

### Step 5: Run the Application
```bash
npm start
```

Visit `http://localhost:5000` in your browser! 🎉

---

## Default Configuration

- **Port**: 5000
- **Environment**: Development
- **Database**: MongoDB Atlas

## Testing the Application

### Home Page
1. Open http://localhost:5000
2. Try guest shortening (limited feature)

### Sign Up
1. Click "Sign Up" button
2. Create account with username, email, password
3. Get automatically logged in

### Login
1. Click "Login" button
2. Enter email and password
3. Access your dashboard

### Dashboard
1. Create new short URLs (authenticated users only)
2. View all your created URLs
3. See click statistics
4. Delete URLs
5. Search and filter URLs

## Features

✅ **Guest**: Can create temporary short links  
✅ **Registered Users**: Can:
   - Create and save short URLs
   - View all created URLs
   - Track click analytics
   - Manage URLs (search, delete)
   - Edit account info

## Common Authentication Tests

- **Try wrong password**: Login will fail
- **Try existing email**: Signup will show error
- **Token expiration**: Tokens valid for 30 days
- **Logout**: Click logout to clear session

---

## Need Help?

Check the main README.md for detailed information about:
- Project structure
- API endpoints
- Database schema
- Troubleshooting guide
- Future enhancements
