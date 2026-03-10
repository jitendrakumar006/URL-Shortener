# Deployment Guide

## Deploy to Production 🚀

### Option 1: Heroku Deployment

#### Prerequisites
- Heroku Account (free at heroku.com)
- Heroku CLI installed

#### Steps

1. **Install Heroku CLI**
   ```bash
   # Windows
   Download from: https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_connection_string
   heroku config:set NODE_ENV=production
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

### Option 2: Vercel Deployment

Note: Vercel is better suited for serverless functions. For a persistent Node.js app, use Heroku or Railway.

### Option 3: Railway.app Deployment

1. Go to [Railway.app](https://railway.app)
2. Connect your GitHub repository
3. Add MongoDB Atlas connection string as environment variable
4. Deploy

### Option 4: AWS/Azure/DigitalOcean VPS

1. SSH into your server
2. Install Node.js and npm
3. Clone your repository
4. Install dependencies: `npm install`
5. Create `.env` file with production settings
6. Use PM2 to run the application:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "url-shortener"
   pm2 startup
   pm2 save
   ```

## Performance Optimization for Production

1. **Use PM2 for Process Management**
   ```bash
   npm install -g pm2
   pm2 start server.js -i max
   ```

2. **Enable Compression Middleware**
   Add to server.js:
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

3. **Add Rate Limiting**
   ```bash
   npm install express-rate-limit
   ```

4. **Setup HTTPS/SSL**
   - Use Let's Encrypt (free SSL)
   - Configure with nginx or Apache

5. **Database Optimization**
   - Create indexes on frequently queried fields
   - Enable MongoDB Atlas backups
   - Monitor connection pool

## Environment Variables for Production

```env
MONGODB_URI=mongodb+srv://prod_user:prod_password@prod-cluster.mongodb.net/url-shortener?retryWrites=true&w=majority
PORT=5000
NODE_ENV=production
```

## Monitoring & Logging

- Use PM2 Plus for monitoring
- Setup error tracking with Sentry
- Monitor MongoDB Atlas metrics
- Use CloudFlare for CDN and DDoS protection

## Scaling Considerations

- Load balancer for multiple server instances
- Redis cache for frequently accessed short URLs
- CDN for static assets
- Database read replicas for high traffic

## Estimated Deployment Time

- Heroku: 5 minutes
- Railway: 10 minutes
- Self-hosted VPS: 30-60 minutes
- AWS: 60+ minutes

## Cost Estimates (Monthly)

- **Heroku**: $7-15 (with paid dyno)
- **Railway**: $5-20
- **DigitalOcean**: $5-12 (basic droplet)
- **MongoDB Atlas**: Free tier (up to 0.5GB) or $10+ for production
- **AWS**: Variable, typically $10-50 for small app

---

Choose the deployment option that best fits your needs and budget!
