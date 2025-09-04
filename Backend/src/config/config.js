import dotenv from 'dotenv';
dotenv.config();

export const config = {
    // Server
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    
    // Database
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/',
    mongoDbName: process.env.MONGO_DB_NAME || 'Hotelbooking',
    
    // JWT
    jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
    
    // Frontend
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    
    // Security
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    
    // Validation
    passwordMinLength: 6,
    usernameMinLength: 3,
    usernameMaxLength: 30
};

export default config; 