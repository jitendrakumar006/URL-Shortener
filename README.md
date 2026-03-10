# URL Shortener Web Application

## Quick Links

- 📖 [Quick Start Guide](QUICK_START.md) - Get started in 5 minutes
- 🔐 [Authentication Guide](AUTHENTICATION.md) - Learn about user authentication
- 🚀 [Deployment Guide](DEPLOYMENT.md) - Deploy to production

## Overview

## Features ✨

- **Simple & Clean Interface**: User-friendly UI with a gradient design
- **User Authentication**: Sign up and login with secure password hashing
- **URL Shortening**: Convert long URLs into short, shareable links
- **Auto Redirection**: Visit short links and automatically redirect to original URLs
- **Click Tracking**: Track the number of clicks on each short link
- **Dashboard**: Manage all your shortened URLs in one place
- **Database Storage**: Store URLs and statistics in MongoDB Atlas
- **URL Validation**: Validate URLs before shortening
- **Duplicate Detection**: Reuse existing short codes for duplicate URLs
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop devices
- **Copy to Clipboard**: One-click copy functionality for short links
- **Search & Filter**: Search your URLs by code or original URL
- **Delete URLs**: Remove URLs you no longer need
- **Analytics**: View click statistics for each URL
- **Secure**: Passwords hashed with bcryptjs, JWT token authentication

## Tech Stack 🛠️

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB ODM
- **shortid**: Generate short unique IDs
- **bcryptjs**: Password hashing and encryption
- **jsonwebtoken**: JWT token authentication

### Frontend
- **HTML5**: Markup
- **CSS3**: Styling with animations and responsive design
- **JavaScript (Vanilla)**: Interactivity

## Project Structure 📁

```
URL-Shortener/
├── config/
│   └── db.js                 # MongoDB connection configuration
├── middleware/
│   └── auth.js               # JWT authentication middleware
├── models/
│   ├── URLModel.js           # URL schema
│   └── User.js               # User schema with password hashing
├── routes/
│   ├── routes.js             # URL shortening routes
│   └── auth.js               # Authentication routes
├── public/
│   ├── index.html            # Home page
│   ├── login.html            # Login page
│   ├── signup.html           # Signup page
│   ├── dashboard.html        # Dashboard page
│   ├── style.css             # Main styling
│   ├── auth.css              # Auth pages styling
│   ├── dashboard.css         # Dashboard styling
│   ├── index.js              # Home page JavaScript
│   ├── login.js              # Login functionality
│   ├── signup.js             # Signup functionality
│   └── dashboard.js          # Dashboard functionality
├── server.js                 # Main Express server
├── package.json              # Dependencies and scripts
├── .env.example              # Environment variables example
└── README.md                 # This file
```

## Prerequisites 📋

Before you begin, ensure you have installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB Atlas Account** - [Sign up](https://www.mongodb.com/cloud/atlas)

## Installation & Setup 🚀

### 1. Clone or Navigate to Project Directory

```bash
cd URL-Shortener
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user with username and password
4. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`)

### 4. Create Environment Variables

Create a `.env` file in the root directory (copy from `.env.example`):

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/url-shortener?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here_min_32_characters_for_production
```

**Important Notes:**
- Replace `YOUR_USERNAME`, `YOUR_PASSWORD`, and `YOUR_CLUSTER` with your MongoDB credentials
- Change `JWT_SECRET` to a strong secret key in production
- Keep your `.env` file private and never commit it to version control

### 5. Start the Server

#### Production Mode
```bash
npm start
```

#### Development Mode (with auto-reload)
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## Usage 📖

### For New Users

1. **Open the Application**: Navigate to `http://localhost:5000` in your browser
2. **Sign Up**: Click "Sign Up" and create a new account with:
   - Username (3-30 characters)
   - Email address
   - Password (minimum 6 characters)
3. **Login**: Use your credentials to log in
4. **Access Dashboard**: After login, you'll be redirected to your personal dashboard

### For Registered Users

1. **Dashboard**: Click "Go to Dashboard" from the home page or directly navigate to `/dashboard.html`
2. **Create Short URL**: 
   - Paste your long URL in the input field
   - Click "Generate Short Link"
   - Your short URL will be created and displayed
3. **Manage URLs**: 
   - View all your created URLs in the dashboard
   - See click statistics for each URL
   - Copy short links to clipboard
   - Delete URLs you no longer need
   - Search URLs by code or original URL
4. **Share Links**: Share your short links with others
5. **Track Analytics**: Monitor clicks and statistics from your dashboard
6. **Logout**: Click the Logout button to exit your account

### Guest Users (Guest Link)

**Note**: Guest users can create short links but cannot:
- Save URLs to their account
- View URL history
- Track analytics
- Manage URLs

We recommend creating an account to unlock all features!

### For Auto Redirect

When someone visits your short link:
1. They access the short link (e.g., `http://localhost:5000/s/abc123`)
2. They are automatically redirected to the original URL
3. Click count is incremented automatically

## API Endpoints 🔗

### Authentication Routes

#### Signup
**POST** `/api/auth/signup`
- Request Body:
  ```json
  {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }
  ```
- Response:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "user_id",
      "username": "johndoe",
      "email": "john@example.com"
    }
  }
  ```

#### Login
**POST** `/api/auth/login`
- Request Body:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- Response:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "user_id",
      "username": "johndoe",
      "email": "john@example.com",
      "createdUrls": 5
    }
  }
  ```

#### Get Current User
**GET** `/api/auth/me`
- Headers: `Authorization: Bearer <token>`
- Response:
  ```json
  {
    "success": true,
    "user": {
      "id": "user_id",
      "username": "johndoe",
      "email": "john@example.com",
      "createdUrls": 5
    }
  }
  ```

### URL Shortening Routes

#### Create Short URL (Protected)
**POST** `/api/shorten`
- Headers: `Authorization: Bearer <token>`
- Request Body:
  ```json
  {
    "originalUrl": "https://example.com/very/long/url"
  }
  ```
- Response:
  ```json
  {
    "originalUrl": "https://example.com/very/long/url",
    "shortCode": "abc123",
    "shortUrl": "http://localhost:5000/s/abc123"
  }
  ```

#### Redirect to Original URL
**GET** `/s/:shortCode`
- Redirects to the original URL and increments click count

#### Get URL Analytics
**GET** `/api/analytics/:shortCode`
- Response:
  ```json
  {
    "originalUrl": "https://example.com/very/long/url",
    "shortCode": "abc123",
    "clicks": 5,
    "createdAt": "2024-03-10T12:00:00Z"
  }
  ```

#### Get User's URLs (Protected)
**GET** `/api/user/urls`
- Headers: `Authorization: Bearer <token>`
- Response:
  ```json
  {
    "success": true,
    "total": 5,
    "urls": [
      {
        "shortCode": "abc123",
        "originalUrl": "https://example.com/url1",
        "shortUrl": "http://localhost:5000/s/abc123",
        "clicks": 10,
        "createdAt": "2024-03-10T12:00:00Z",
        "_id": "url_id"
      }
    ]
  }
  ```

#### Delete Short URL (Protected)
**DELETE** `/api/url/:shortCode`
- Headers: `Authorization: Bearer <token>`
- Response:
  ```json
  {
    "success": true,
    "message": "Short URL deleted successfully"
  }
  ```

## Responsive Design 📱

The application is fully responsive and optimized for:
- **Desktop**: Full-featured experience
- **Tablet**: Adjusted layout and touch-friendly buttons
- **Mobile**: Optimized single-column layout

Media Breakpoints:
- **Desktop**: 1025px and above
- **Tablet**: 769px to 1024px
- **Mobile**: Below 768px

## Error Handling ⚠️

The application includes comprehensive error handling:
- Invalid URL format detection
- Empty input validation
- Server error management
- Network error handling
- User-friendly error messages

## Database Schema 📊

### User Model
```javascript
{
  _id: ObjectId,
  username: String (unique, 3-30 chars, alphanumeric),
  email: String (unique, valid email format),
  password: String (hashed with bcryptjs),
  createdUrls: Number (default: 0),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

### URL Model
```javascript
{
  _id: ObjectId,
  originalUrl: String (required, validated),
  shortCode: String (required, unique, auto-generated),
  userId: ObjectId (ref: User, optional for guests),
  clicks: Number (default: 0),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

## Security Considerations 🔐

- URL validation to prevent invalid URLs
- Unique short codes to prevent conflicts
- MongoDB Atlas connection with authentication
- Input sanitization
- CORS enabled for API requests

## Performance Tips ⚡

- Short URLs are cached using the duplicate detection mechanism
- MongoDB indexing on `shortCode` for O(1) lookups
- Minimal CSS for fast loading
- Optimized JavaScript without dependencies

## Troubleshooting 🔧

### "Cannot find module" Error
```bash
npm install
```

### MongoDB Connection Error
- Check your `.env` file for correct credentials
- Ensure your IP is whitelisted in MongoDB Atlas Network Access
- Verify database name is correct

### Port Already in Use
```bash
# Change PORT in .env file or use
PORT=3000 npm start
```

### Animations Not Working
- Clear browser cache
- Check CSS file is loaded (`style.css` in `/public`)
- Verify JavaScript is enabled in browser

## Future Enhancements 🚀

- Custom short codes/aliases (user-defined short links)
- Link expiration dates
- Password-protected links
- QR code generation
- Advanced analytics (geographic data, device info, etc.)
- Link category/tagging system
- Public/private URL visibility settings
- API rate limiting per user
- Social media integration
- Bulk URL upload
- Email notifications for link analytics

## License 📄

ISC License

## Support 💬

For issues or questions, please create an issue in the repository or contact the maintainers.

## Contributing 🤝

Contributions are welcome! Please feel free to submit pull requests.

---

**Happy URL Shortening!** 🎉
