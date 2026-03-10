# Authentication & User Guide

## Overview

The URL Shortener now includes full user authentication with secure password hashing and JWT token-based authorization. Users can create accounts, login, and manage their personal URL collection.

## Authentication Features

### User Registration (Sign Up)

**Password Requirements:**
- Minimum 6 characters
- Must match confirmation password
- Stored securely with bcryptjs hashing (salt rounds: 10)

**Username Requirements:**
- 3-30 characters
- Alphanumeric, hyphens, and underscores only
- Must be unique

**Email Requirements:**
- Valid email format
- Must be unique
- Case-insensitive storage

**Sign Up Validation:**
- All fields required
- No duplicate emails or usernames
- Passwords must match

### User Login

**Login Process:**
1. User enters email and password
2. System verifies email exists in database
3. Password compared with stored hash (bcryptjs)
4. If valid, JWT token generated and returned
5. Token stored in browser's localStorage

**Token Details:**
- Type: JWT (JSON Web Token)
- Expiration: 30 days from creation
- Algorithm: HS256
- Stored: Browser localStorage

### Session Management

**Token Storage:**
```javascript
// Stored in localStorage
localStorage.setItem('token', jwtToken);
localStorage.setItem('user', JSON.stringify(userData));
```

**Logout:**
- Removes token from localStorage
- Removes user data from localStorage
- Redirects to login page

**Session Persistence:**
- Tokens persist across browser sessions
- Automatically expires after 30 days
- Can be manually revoked by logout

## Security Measures

### Password Security
- **Hashing Algorithm**: bcryptjs with 10 salt rounds
- **Never Stored**: Plain passwords never stored in database
- **Verified**: Password compared using secure hash comparison
- **Salted**: Each password has unique salt for security

### Token Security
- **JWT Signature**: Signed with SECRET_KEY
- **Expiration**: 30-day validity period
- **Verification**: Signature verified on each request
- **Secure Transport**: Should use HTTPS in production

### Data Protection
- **Unique Constraints**: Email and username unique at database level
- **Validation**: All inputs validated before processing
- **Error Messages**: Generic error messages prevent user enumeration
- **CORS**: Cross-origin requests handled safely

### Best Practices

**For Development:**
- Use provided .env.example
- Keep JWT_SECRET secure
- Never commit .env file
- Use strong passwords for testing

**For Production:**
- Use strong JWT_SECRET (32+ characters)
- Enable HTTPS/SSL
- Implement rate limiting
- Add request logging
- Monitor failed login attempts
- Regularly rotate secrets

## API Authentication

### Making Authenticated Requests

Include token in Authorization header:

```javascript
// JavaScript Fetch
const token = localStorage.getItem('token');

fetch('/api/user/urls', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

```bash
# cURL
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/user/urls
```

### Token Format

```
Authentication: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Response Codes

- **200**: Success
- **201**: Created (signup success)
- **400**: Bad request (validation error)
- **401**: Unauthorized (invalid credentials or expired token)
- **404**: Not found
- **500**: Server error

## Pages & Routes

### Public Pages
- **Home** (`/`) - Guest shortening, login/signup buttons
- **Login** (`/login.html`) - User login form
- **Signup** (`/signup.html`) - User registration form

### Protected Pages (Require Login)
- **Dashboard** (`/dashboard.html`) - User's personal dashboard
- **API Endpoints** - Require Authorization header

### Redirects
- Non-logged user accessing dashboard → redirected to login
- Logged user accessing signup/login → redirected to dashboard
- Guest accessing protected routes → 401 error

## User Dashboard Features

### Dashboard Functions

1. **Create Short URLs**
   - Paste long URL
   - Generate short link
   - Auto-saved to user account

2. **View All URLs**
   - List of all created URLs
   - Original URL display
   - Short code display

3. **Track Analytics**
   - Click count for each URL
   - Creation date and time
   - Last updated information

4. **Manage URLs**
   - Copy short link (one-click)
   - Delete URL permanently
   - Open in new tab
   - Search and filter URLs

5. **Statistics**
   - Total URLs created
   - Total clicks across all URLs
   - Individual URL analytics

## Database Schemas

### User Collection
```javascript
{
  _id: ObjectId,
  username: String,           // Unique, 3-30 chars
  email: String,              // Unique, lowercase
  password: String,           // Bcrypt hash
  createdUrls: Number,        // Count of created URLs
  createdAt: Date,            // Account creation date
  updatedAt: Date             // Last update
}
```

### URL Collection
```javascript
{
  _id: ObjectId,
  originalUrl: String,        // Original long URL
  shortCode: String,          // Unique short code
  userId: ObjectId,           // Reference to User (optional)
  clicks: Number,             // Click count
  createdAt: Date,            // Creation date
  updatedAt: Date             // Last update
}
```

## Environment Configuration

### Required Variables

```env
# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db

# Server
PORT=5000
NODE_ENV=development

# Authentication
JWT_SECRET=your_very_long_secret_key_min_32_chars_prod
```

### Development vs Production

**Development:**
```env
NODE_ENV=development
JWT_SECRET=dev-secret-key
MONGODB_URI=mongodb+srv://dev:dev@dev-cluster.mongodb.net/dev
```

**Production:**
```env
NODE_ENV=production
JWT_SECRET=very_long_cryptographically_secure_key_here
MONGODB_URI=mongodb+srv://prod:prod@prod-cluster.mongodb.net/prod
```

## Troubleshooting

### Login Issues

**"Invalid credentials"**
- Check email spelling
- Verify password
- Ensure account exists

**"User not found"**
- Create new account via signup
- Check email is correct

**"Token expired"**
- Login again
- Token is valid for 30 days

### Signup Issues

**"Username or email already registered"**
- Choose different username/email
- Login instead if account exists

**"Passwords do not match"**
- Enter same password in both fields
- Check caps lock

**"Password must be at least 6 characters"**
- Use minimum 6 characters
- Increase complexity for security

**"Invalid email"**
- Use valid email format (user@domain.com)
- No spaces or special characters

### Dashboard Issues

**"Not authorized to access this route"**
- Token expired: logout and login again
- Token missing: refresh the page
- Clear browser cache and try again

**"Short URL not found"**
- URL may have been deleted
- Check short code is correct

## Rate Limiting Recommendations

For production deployment, add rate limiting:

```javascript
// Suggested limits
POST /api/auth/signup - 5 requests per 24 hours per IP
POST /api/auth/login - 5 requests per 15 minutes per IP
POST /api/shorten - 100 requests per hour per user
GET /api/user/urls - 100 requests per hour per user
```

## HTTPS & SSL

**Required for Production:**
- All authentication should use HTTPS
- Cookies should have secure flag
- HSTS headers recommended
- SSL certificate required

## Session Duration

- **Token Lifetime**: 30 days
- **Recommended Refresh**: Users should re-login quarterly
- **Revocation**: Not implemented (login again to create new token)

## Account Security Tips

### For Users
1. Use strong, unique passwords
2. Don't share your token
3. Logout on shared computers
4. Keep email up-to-date
5. Never click suspicious links

### For Developers
1. Use environment variables for secrets
2. Never log tokens or passwords
3. Validate all inputs
4. Use HTTPS in production
5. Monitor failed login attempts
6. Implement rate limiting
7. Keep dependencies updated

## Support & FAQ

**Q: Can I change my password?**
A: Feature coming soon. For now, create a new account.

**Q: What if I forget my password?**
A: Password reset feature coming soon. Contact support.

**Q: How secure is my data?**
A: Passwords are hashed with bcryptjs, tokens signed with JWT, HTTPS recommended.

**Q: Can I have multiple accounts?**
A: Yes, with different emails.

**Q: How long do sessions last?**
A: Tokens valid for 30 days. Auto-login from localStorage persists across sessions.

---

For more information, see [README.md](README.md)
