# Backend Deployment Guide

## Platform-Specific Deployment

### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or use the vercel.json configuration
```

### Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy
railway login
railway init
railway up
```

### Netlify Functions
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### Heroku
```bash
# Install Heroku CLI
# Create Procfile
echo "web: npm start" > Procfile

# Deploy
git add .
git commit -m "Deploy backend"
git push heroku main
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## Environment Variables Required

Create a `.env` file with:
```
NODE_ENV=production
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=your_frontend_url
```

## Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Start production
npm start

# Deploy (build + start)
npm run deploy
```

## Health Check

The backend includes a health endpoint:
- URL: `/health`
- Method: GET
- Response: `{ "status": "OK", "timestamp": "..." }`

## Troubleshooting

### Entrypoint Error
If you get "No entrypoint found" error:
1. Ensure `index.js` is in the root directory
2. Check that `package.json` has correct `main` field
3. Verify the deployment platform configuration

### Common Issues
- **Port binding**: Ensure the platform sets the PORT environment variable
- **Database connection**: Verify MONGO_URI is correctly set
- **CORS**: Check FRONTEND_URL is set correctly
