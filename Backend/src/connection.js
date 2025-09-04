import { connect } from 'mongoose';
import { config } from './config/config.js';

const connectDB = async () => {
    try {
        const connectionString = `${config.mongoUri}${config.mongoDbName}`;
        
        await connect(connectionString, {
            // MongoDB connection options
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    }
};

export default connectDB;





