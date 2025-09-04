import mongoose from 'mongoose';
import fs from 'fs';
import dotenv from 'dotenv';
import Hotel from './src/models/hotel.model.js';

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel-booking', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Import hotels data
const importHotels = async () => {
    try {
        // Read the JSON file
        const hotelsData = JSON.parse(fs.readFileSync('./hotels_data_indian.json', 'utf8'));
        
        console.log(`Found ${hotelsData.length} hotels to import`);
        
        // Clear existing hotels (optional - remove this if you want to keep existing data)
        await Hotel.deleteMany({});
        console.log('Cleared existing hotels');
        
        // Import hotels
        const importedHotels = await Hotel.insertMany(hotelsData);
        console.log(`Successfully imported ${importedHotels.length} hotels`);
        
        // Display summary
        console.log('\n=== IMPORT SUMMARY ===');
        importedHotels.forEach((hotel, index) => {
            console.log(`${index + 1}. ${hotel.name} - ${hotel.location}`);
            console.log(`   Rooms: ${hotel.rooms.length}`);
            console.log(`   Price Range: ${hotel.price_range}`);
            console.log(`   Rating: ${hotel.rating}/5`);
            console.log('');
        });
        
    } catch (error) {
        console.error('Error importing hotels:', error);
    } finally {
        mongoose.connection.close();
        console.log('Database connection closed');
    }
};

// Run the import
const runImport = async () => {
    await connectDB();
    await importHotels();
};

runImport();
