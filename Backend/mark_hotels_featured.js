import mongoose from 'mongoose';
import Hotel from './src/models/hotel.model.js';
import dotenv from 'dotenv';

dotenv.config();

const markHotelsFeatured = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel-booking');
        console.log('MongoDB connected successfully');
        
        // Mark all hotels as featured
        const result = await Hotel.updateMany({}, { featured: true });
        console.log(`Updated ${result.modifiedCount} hotels to be featured`);
        
        // Verify the update
        const featuredHotels = await Hotel.find({ featured: true });
        console.log(`\nNow ${featuredHotels.length} hotels are featured:`);
        featuredHotels.forEach((hotel, index) => {
            console.log(`${index + 1}. ${hotel.name} - ${hotel.location}`);
        });
        
    } catch (error) {
        console.error('Error marking hotels as featured:', error);
    } finally {
        mongoose.connection.close();
        console.log('\nDatabase connection closed');
    }
};

markHotelsFeatured();

