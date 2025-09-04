# Render Deployment Guide

## 🚀 **Deployment Options for Full-Stack Project**

### **Option 1: Separate Deployments (Recommended)**

Deploy frontend and backend as separate services for better scalability and management.

#### **Backend Deployment:**
1. **Service Type**: Web Service
2. **Environment**: Node
3. **Build Command**: `npm install && npm run build`
4. **Start Command**: `npm start`
5. **Root Directory**: `Backend`
6. **Health Check Path**: `/health`

#### **Frontend Deployment:**
1. **Service Type**: Static Site
2. **Build Command**: `npm install && npm run build`
3. **Publish Directory**: `dist`
4. **Root Directory**: `Front-End`

### **Option 2: Monorepo Deployment**

Deploy everything as one service using the root `render.yaml`.

## 📋 **Step-by-Step Deployment**

### **Backend Deployment:**

1. **Connect Repository to Render**
   - Go to Render Dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Backend Service**
   ```
   Name: hotel-booking-backend
   Environment: Node
   Root Directory: Backend
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

3. **Set Environment Variables**
   ```
   NODE_ENV=production
   PORT=10000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=https://your-frontend-url.onrender.com
   ```

### **Frontend Deployment:**

1. **Create Frontend Service**
   - Go to Render Dashboard
   - Click "New +" → "Static Site"
   - Connect your GitHub repository

2. **Configure Frontend Service**
   ```
   Name: hotel-booking-frontend
   Root Directory: Front-End
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

3. **Set Environment Variables**
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

## 🔧 **Configuration Files Created**

### **Backend (`Backend/render.yaml`):**
```yaml
services:
  - type: web
    name: hotel-booking-backend
    env: node
    plan: free
    buildCommand: npm install && npm run build
    startCommand: npm start
    healthCheckPath: /health
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: MONGO_URI
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: FRONTEND_URL
        sync: false
```

### **Frontend (`Front-End/render.yaml`):**
```yaml
services:
  - type: web
    name: hotel-booking-frontend
    env: static
    plan: free
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist
    envVars:
      - key: VITE_API_URL
        value: https://hotel-booking-backend.onrender.com
```

## 🌐 **URLs After Deployment**

- **Backend**: `https://hotel-booking-backend.onrender.com`
- **Frontend**: `https://hotel-booking-frontend.onrender.com`
- **API Health Check**: `https://hotel-booking-backend.onrender.com/health`

## ⚡ **Quick Deploy Commands**

### **Using Render CLI (if available):**
```bash
# Deploy backend
render deploy --service hotel-booking-backend

# Deploy frontend
render deploy --service hotel-booking-frontend
```

### **Manual Deployment:**
1. Push code to GitHub
2. Connect repository to Render
3. Configure services using the provided YAML files
4. Set environment variables
5. Deploy!

## 🔍 **Troubleshooting**

### **Common Issues:**
1. **Build Failures**: Check build commands and dependencies
2. **CORS Issues**: Verify FRONTEND_URL environment variable
3. **Database Connection**: Ensure MONGO_URI is correctly set
4. **Health Check**: Verify health endpoint is accessible

### **Debug Commands:**
```bash
# Test backend locally
cd Backend
npm run build
npm start

# Test frontend locally
cd Front-End
npm run build
npm run preview
```

## 📊 **Monitoring**

- **Backend Health**: `https://your-backend-url.onrender.com/health`
- **Render Dashboard**: Monitor service status and logs
- **Environment Variables**: Manage in Render dashboard

## 💡 **Recommendations**

1. **Use Separate Deployments**: Better for scaling and maintenance
2. **Set up Custom Domains**: For production use
3. **Monitor Logs**: Use Render's log viewer for debugging
4. **Environment Variables**: Keep sensitive data secure
5. **Health Checks**: Monitor service availability
