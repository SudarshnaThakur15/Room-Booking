import Hotel from '../models/hotel.model.js';

// ========================================
// HOTEL CONTROLLER - PUBLIC ENDPOINTS
// ========================================

// Get all hotels
export const getAllHotels = async (req, res) => {
    try {
        const { page = 1, limit = 20, sortBy = 'rating', sortOrder = 'desc' } = req.query;
        const skip = (page - 1) * limit;

        // Build sort object
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Find hotels - don't filter by isActive yet since old data might not have this field
        const hotels = await Hotel.find({})
            .populate('rooms')
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Hotel.countDocuments({});

        // Transform hotels to ensure consistent format
        const transformedHotels = hotels.map(hotel => {
            const hotelObj = hotel.toObject();
            
            // Ensure amenities is always an array
            if (typeof hotelObj.amenities === 'string') {
                hotelObj.amenities = hotelObj.amenities.split(',').map(a => a.trim());
            } else if (!Array.isArray(hotelObj.amenities)) {
                hotelObj.amenities = [];
            }
            
            // Ensure images is always an array
            if (!Array.isArray(hotelObj.images)) {
                hotelObj.images = [];
            }
            
            // Ensure rooms is always an array
            if (!Array.isArray(hotelObj.rooms)) {
                hotelObj.rooms = [];
            }
            
            return hotelObj;
        });

        res.status(200).json({
            hotels: transformedHotels,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(total / limit),
                totalHotels: total
            }
        });
    } catch (error) {
        console.error('Get All Hotels Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get hotel by ID
export const getHotelById = async (req, res) => {
    try {
        const { id } = req.params;
        const hotel = await Hotel.findById(id).populate('rooms');
        
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        // Transform hotel to ensure consistent format
        const hotelObj = hotel.toObject();
        
        // Ensure amenities is always an array
        if (typeof hotelObj.amenities === 'string') {
            hotelObj.amenities = hotelObj.amenities.split(',').map(a => a.trim());
        } else if (!Array.isArray(hotelObj.amenities)) {
            hotelObj.amenities = [];
        }
        
        // Ensure images is always an array
        if (!Array.isArray(hotelObj.images)) {
            hotelObj.images = [];
        }
        
        // Ensure rooms is always an array
        if (!Array.isArray(hotelObj.rooms)) {
            hotelObj.rooms = [];
        }

        res.status(200).json(hotelObj);
    } catch (error) {
        console.error('Get Hotel Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Basic search hotels
export const searchHotels = async (req, res) => {
    try {
        const { 
            query: searchQuery,
            location, 
            priceRange, 
            rating, 
            amenities,
            category,
            page = 1,
            limit = 20,
            sortBy = 'rating',
            sortOrder = 'desc'
        } = req.query;
        
        const skip = (page - 1) * limit;
        let query = {};
        
        // Name/Description search
        if (searchQuery) {
            query.$or = [
                { name: { $regex: searchQuery, $options: 'i' } },
                { description: { $regex: searchQuery, $options: 'i' } }
            ];
        }
        
        // Location search (city, area, landmarks)
        if (location) {
            const locationQuery = {
                $or: [
                    { location: { $regex: location, $options: 'i' } },
                    { 'contact.city': { $regex: location, $options: 'i' } },
                    { 'contact.state': { $regex: location, $options: 'i' } },
                    { 'contact.country': { $regex: location, $options: 'i' } }
                ]
            };
            
            // If we already have a query from name search, combine them with $and
            if (query.$or) {
                query = { $and: [query, locationQuery] };
            } else {
                query = locationQuery;
            }
        }
        
        // Price range filter
        if (priceRange) {
            query.price_range = priceRange;
        }
        
        // Rating filter
        if (rating) {
            query.rating = { $gte: parseFloat(rating) };
        }
        
        // Category filter
        if (category) {
            query.category = { $regex: category, $options: 'i' };
        }
        
        // Amenities filter - handle both string and array formats
        if (amenities) {
            const amenityArray = amenities.split(',').map(a => a.trim());
            query.$or = [
                { amenities: { $all: amenityArray } }, // For new array format
                { amenities: { $regex: amenityArray.join('|'), $options: 'i' } } // For old string format
            ];
        }

        // Build sort object
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const hotels = await Hotel.find(query)
            .populate('rooms')
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Hotel.countDocuments(query);

        // Transform hotels to ensure consistent format
        const transformedHotels = hotels.map(hotel => {
            const hotelObj = hotel.toObject();
            
            // Ensure amenities is always an array
            if (typeof hotelObj.amenities === 'string') {
                hotelObj.amenities = hotelObj.amenities.split(',').map(a => a.trim());
            } else if (!Array.isArray(hotelObj.amenities)) {
                hotelObj.amenities = [];
            }
            
            // Ensure images is always an array
            if (!Array.isArray(hotelObj.images)) {
                hotelObj.images = [];
            }
            
            // Ensure rooms is always an array
            if (!Array.isArray(hotelObj.rooms)) {
                hotelObj.rooms = [];
            }
            
            return hotelObj;
        });

        res.status(200).json({
            hotels: transformedHotels,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(total / limit),
                totalHotels: total
            },
            filters: {
                query: searchQuery,
                location,
                priceRange,
                rating,
                amenities
            },
            message: total === 0 ? 'No hotels found for the given criteria' : null
        });
    } catch (error) {
        console.error('Search Hotels Error:', error);
        res.status(500).json({ 
            message: 'Server error',
            hotels: [],
            pagination: {
                current: 1,
                total: 0,
                totalHotels: 0
            }
        });
    }
};

// Advanced search with multiple filters
export const advancedSearch = async (req, res) => {
    try {
        const {
            query: searchQuery,
            location,
            priceRange,
            rating,
            amenities,
            category,
            roomType,
            checkIn,
            checkOut,
            guests,
            page = 1,
            limit = 20,
            sortBy = 'rating',
            sortOrder = 'desc'
        } = req.query;

        const skip = (page - 1) * limit;
        let query = {};

        // Text search across multiple fields
        if (searchQuery) {
            query.$or = [
                { name: { $regex: searchQuery, $options: 'i' } },
                { location: { $regex: searchQuery, $options: 'i' } },
                { description: { $regex: searchQuery, $options: 'i' } },
                { 'contact.city': { $regex: searchQuery, $options: 'i' } },
                { 'contact.state': { $regex: searchQuery, $options: 'i' } }
            ];
        }

        // Location filter
        if (location) {
            query.$or = [
                { location: { $regex: location, $options: 'i' } },
                { 'contact.city': { $regex: location, $options: 'i' } },
                { 'contact.state': { $regex: location, $options: 'i' } },
                { 'contact.country': { $regex: location, $options: 'i' } }
            ];
        }

        // Price range filter
        if (priceRange) {
            query.price_range = priceRange;
        }

        // Rating filter
        if (rating) {
            query.rating = { $gte: parseFloat(rating) };
        }

        // Category filter
        if (category) {
            query.category = { $regex: category, $options: 'i' };
        }

        // Amenities filter - handle both string and array formats
        if (amenities) {
            const amenityArray = amenities.split(',').map(a => a.trim());
            query.$or = [
                { amenities: { $all: amenityArray } }, // For new array format
                { amenities: { $regex: amenityArray.join('|'), $options: 'i' } } // For old string format
            ];
        }

        // Room type filter
        if (roomType) {
            query['rooms.type'] = { $regex: roomType, $options: 'i' };
        }

        // Guest capacity filter
        if (guests) {
            query['rooms.capacity'] = { $gte: parseInt(guests) };
        }

        // Build sort object
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const hotels = await Hotel.find(query)
            .populate('rooms')
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Hotel.countDocuments(query);

        // Transform hotels to ensure consistent format
        const transformedHotels = hotels.map(hotel => {
            const hotelObj = hotel.toObject();
            
            // Ensure amenities is always an array
            if (typeof hotelObj.amenities === 'string') {
                hotelObj.amenities = hotelObj.amenities.split(',').map(a => a.trim());
            } else if (!Array.isArray(hotelObj.amenities)) {
                hotelObj.amenities = [];
            }
            
            // Ensure images is always an array
            if (!Array.isArray(hotelObj.images)) {
                hotelObj.images = [];
            }
            
            // Ensure rooms is always an array
            if (!Array.isArray(hotelObj.rooms)) {
                hotelObj.rooms = [];
            }
            
            return hotelObj;
        });

        res.status(200).json({
            hotels: transformedHotels,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(total / limit),
                totalHotels: total
            },
            filters: {
                searchQuery,
                location,
                priceRange,
                rating,
                amenities,
                roomType,
                checkIn,
                checkOut,
                guests
            },
            message: total === 0 ? 'No hotels found for the given criteria' : null
        });
    } catch (error) {
        console.error('Advanced Search Error:', error);
        res.status(500).json({ 
            message: 'Server error',
            hotels: [],
            pagination: {
                current: 1,
                total: 0,
                totalHotels: 0
            }
        });
    }
};

// Get featured hotels
export const getFeaturedHotels = async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        
        const hotels = await Hotel.find({ 
            featured: true // Only include hotels explicitly marked as featured
        })
        .populate('rooms')
        .sort({ rating: -1 })
        .limit(parseInt(limit));

        // Transform hotels to ensure consistent format
        const transformedHotels = hotels.map(hotel => {
            const hotelObj = hotel.toObject();
            
            // Ensure amenities is always an array
            if (typeof hotelObj.amenities === 'string') {
                hotelObj.amenities = hotelObj.amenities.split(',').map(a => a.trim());
            } else if (!Array.isArray(hotelObj.amenities)) {
                hotelObj.amenities = [];
            }
            
            // Ensure images is always an array
            if (!Array.isArray(hotelObj.images)) {
                hotelObj.images = [];
            }
            
            // Ensure rooms is always an array
            if (!Array.isArray(hotelObj.rooms)) {
                hotelObj.rooms = [];
            }
            
            return hotelObj;
        });

        res.status(200).json({
            hotels: transformedHotels,
            count: transformedHotels.length
        });
    } catch (error) {
        console.error('Get Featured Hotels Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get hotels by location
export const getHotelsByLocation = async (req, res) => {
    try {
        const { location } = req.params;
        const { page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        const query = {
            $or: [
                { location: { $regex: location, $options: 'i' } },
                { 'contact.city': { $regex: location, $options: 'i' } },
                { 'contact.state': { $regex: location, $options: 'i' } },
                { 'contact.country': { $regex: location, $options: 'i' } }
            ]
        };

        const hotels = await Hotel.find(query)
            .populate('rooms')
            .sort({ rating: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Hotel.countDocuments(query);

        // Transform hotels to ensure consistent format
        const transformedHotels = hotels.map(hotel => {
            const hotelObj = hotel.toObject();
            
            // Ensure amenities is always an array
            if (typeof hotelObj.amenities === 'string') {
                hotelObj.amenities = hotelObj.amenities.split(',').map(a => a.trim());
            } else if (!Array.isArray(hotelObj.amenities)) {
                hotelObj.amenities = [];
            }
            
            // Ensure images is always an array
            if (!Array.isArray(hotelObj.images)) {
                hotelObj.images = [];
            }
            
            // Ensure rooms is always an array
            if (!Array.isArray(hotelObj.rooms)) {
                hotelObj.rooms = [];
            }
            
            return hotelObj;
        });

        res.status(200).json({
            hotels: transformedHotels,
            location: location,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(total / limit),
                totalHotels: total
            }
        });
    } catch (error) {
        console.error('Get Hotels By Location Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get hotels by price range
export const getHotelsByPriceRange = async (req, res) => {
    try {
        const { range } = req.params;
        const { page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        const hotels = await Hotel.find({ 
            price_range: { $regex: range, $options: 'i' }
        })
        .populate('rooms')
        .sort({ rating: -1 })
        .skip(skip)
        .limit(parseInt(limit));

        const total = await Hotel.countDocuments({ 
            price_range: { $regex: range, $options: 'i' }
        });

        // Transform hotels to ensure consistent format
        const transformedHotels = hotels.map(hotel => {
            const hotelObj = hotel.toObject();
            
            // Ensure amenities is always an array
            if (typeof hotelObj.amenities === 'string') {
                hotelObj.amenities = hotelObj.amenities.split(',').map(a => a.trim());
            } else if (!Array.isArray(hotelObj.amenities)) {
                hotelObj.amenities = [];
            }
            
            // Ensure images is always an array
            if (!Array.isArray(hotelObj.images)) {
                hotelObj.images = [];
            }
            
            // Ensure rooms is always an array
            if (!Array.isArray(hotelObj.rooms)) {
                hotelObj.rooms = [];
            }
            
            return hotelObj;
        });

        res.status(200).json({
            hotels: transformedHotels,
            priceRange: range,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(total / limit),
                totalHotels: total
            }
        });
    } catch (error) {
        console.error('Get Hotels By Price Range Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get hotels by amenities
export const getHotelsByAmenity = async (req, res) => {
    try {
        const { amenity } = req.params;
        const { page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        // Search in both array and string formats
        const query = {
            $or: [
                { amenities: { $regex: amenity, $options: 'i' } }, // For old string format
                { amenities: { $in: [new RegExp(amenity, 'i')] } } // For new array format
            ]
        };

        const hotels = await Hotel.find(query)
            .populate('rooms')
            .sort({ rating: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Hotel.countDocuments(query);

        // Transform hotels to ensure consistent format
        const transformedHotels = hotels.map(hotel => {
            const hotelObj = hotel.toObject();
            
            // Ensure amenities is always an array
            if (typeof hotelObj.amenities === 'string') {
                hotelObj.amenities = hotelObj.amenities.split(',').map(a => a.trim());
            } else if (!Array.isArray(hotelObj.amenities)) {
                hotelObj.amenities = [];
            }
            
            // Ensure images is always an array
            if (!Array.isArray(hotelObj.images)) {
                hotelObj.images = [];
            }
            
            // Ensure rooms is always an array
            if (!Array.isArray(hotelObj.rooms)) {
                hotelObj.rooms = [];
            }
            
            return hotelObj;
        });

        res.status(200).json({
            hotels: transformedHotels,
            amenity: amenity,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(total / limit),
                totalHotels: total
            }
        });
    } catch (error) {
        console.error('Get Hotels By Amenity Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}; 