import Hotel from '../models/hotel.model.js';
import { UserBehavior, HotelMetrics } from '../models/analytics.model.js';

// ========================================
// ADMIN HOTEL MANAGEMENT CONTROLLER
// ========================================

// Create new hotel (Admin only)
export const createHotel = async (req, res) => {
    try {
        const adminId = req.user.userId;
        const {
            name, location, description, rating, amenities, price_range,
            contact, businessHours, basePrice, seasonalPricing, images
        } = req.body;

        // Validate required fields
        if (!name || !location) {
            return res.status(400).json({
                message: 'Hotel name and location are required'
            });
        }

        // Create new hotel
        const newHotel = new Hotel({
            name,
            location,
            description,
            rating: rating || 0,
            amenities: amenities || [],
            price_range,
            contact: contact || {},
            businessHours: businessHours || {},
            basePrice,
            seasonalPricing: seasonalPricing || [],
            images: images || [],
            createdBy: adminId,
            lastUpdatedBy: adminId,
            isActive: true,
            featured: false,
            verified: false
        });

        await newHotel.save();

        // Initialize hotel metrics
        await HotelMetrics.create({
            hotelId: newHotel._id,
            date: new Date(),
            totalViews: 0,
            uniqueViews: 0,
            totalBookings: 0,
            confirmedBookings: 0,
            cancelledBookings: 0,
            totalRevenue: 0,
            averageBookingValue: 0,
            averageRating: 0,
            totalRatings: 0,
            totalRooms: 0,
            occupiedRooms: 0,
            occupancyRate: 0
        });

        res.status(201).json({
            message: 'Hotel created successfully',
            hotel: newHotel
        });
    } catch (error) {
        console.error('Create Hotel Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all hotels with admin details
export const getAllHotels = async (req, res) => {
    try {
        const { page = 1, limit = 20, search, status, featured, verified } = req.query;
        const skip = (page - 1) * limit;

        let query = {};

        // Apply filters
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        if (status !== undefined) {
            query.isActive = status === 'true';
        }

        if (featured !== undefined) {
            query.featured = featured === 'true';
        }

        if (verified !== undefined) {
            query.verified = verified === 'true';
        }

        // Get hotels with populated admin info
        const hotels = await Hotel.find(query)
            .populate('createdBy', 'username email firstName lastName')
            .populate('lastUpdatedBy', 'username email firstName lastName')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Hotel.countDocuments(query);

        res.status(200).json({
            hotels,
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

// Get single hotel with detailed admin info
export const getHotelById = async (req, res) => {
    try {
        const { hotelId } = req.params;

        const hotel = await Hotel.findById(hotelId)
            .populate('createdBy', 'username email firstName lastName')
            .populate('lastUpdatedBy', 'username email firstName lastName');

        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        res.status(200).json(hotel);
    } catch (error) {
        console.error('Get Hotel Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update hotel (Admin only)
export const updateHotel = async (req, res) => {
    try {
        const adminId = req.user.userId;
        const { hotelId } = req.params;
        const updateData = req.body;

        // Remove fields that shouldn't be updated directly
        delete updateData.createdBy;
        delete updateData.totalBookings;
        delete updateData.totalRevenue;
        delete updateData.averageRating;
        delete updateData.reviewCount;

        const hotel = await Hotel.findByIdAndUpdate(
            hotelId,
            {
                ...updateData,
                lastUpdatedBy: adminId,
                updatedAt: new Date()
            },
            { new: true, runValidators: true }
        ).populate('createdBy', 'username email firstName lastName')
         .populate('lastUpdatedBy', 'username email firstName lastName');

        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        res.status(200).json({
            message: 'Hotel updated successfully',
            hotel
        });
    } catch (error) {
        console.error('Update Hotel Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete hotel (Admin only) - Soft delete
export const deleteHotel = async (req, res) => {
    try {
        const { hotelId } = req.params;

        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        // Soft delete - mark as inactive
        hotel.isActive = false;
        hotel.updatedAt = new Date();
        await hotel.save();

        res.status(200).json({
            message: 'Hotel deleted successfully (marked as inactive)'
        });
    } catch (error) {
        console.error('Delete Hotel Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Toggle hotel status (active/inactive)
export const toggleHotelStatus = async (req, res) => {
    try {
        const { hotelId } = req.params;
        const { isActive } = req.body;

        const hotel = await Hotel.findByIdAndUpdate(
            hotelId,
            { 
                isActive: isActive,
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        res.status(200).json({
            message: `Hotel ${isActive ? 'activated' : 'deactivated'} successfully`,
            hotel
        });
    } catch (error) {
        console.error('Toggle Hotel Status Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Toggle featured status
export const toggleFeaturedStatus = async (req, res) => {
    try {
        const { hotelId } = req.params;
        const { featured } = req.body;

        const hotel = await Hotel.findByIdAndUpdate(
            hotelId,
            { 
                featured: featured,
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        res.status(200).json({
            message: `Hotel ${featured ? 'marked as featured' : 'unmarked as featured'} successfully`,
            hotel
        });
    } catch (error) {
        console.error('Toggle Featured Status Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Toggle verification status
export const toggleVerificationStatus = async (req, res) => {
    try {
        const { hotelId } = req.params;
        const { verified } = req.body;

        const hotel = await Hotel.findByIdAndUpdate(
            hotelId,
            { 
                verified: verified,
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        res.status(200).json({
            message: `Hotel ${verified ? 'verified' : 'unverified'} successfully`,
            hotel
        });
    } catch (error) {
        console.error('Toggle Verification Status Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ========================================
// ROOM MANAGEMENT
// ========================================

// Add room to hotel
export const addRoom = async (req, res) => {
    try {
        const { hotelId } = req.params;
        const {
            type, name, roomNumber, floor, capacity, bedType,
            price, basePrice, amenities, description, pictures
        } = req.body;

        // Validate required fields
        if (!type || !name || !price) {
            return res.status(400).json({
                message: 'Room type, name, and price are required'
            });
        }

        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        // Check if room number already exists
        if (roomNumber && hotel.rooms.some(room => room.roomNumber === roomNumber)) {
            return res.status(400).json({
                message: 'Room number already exists in this hotel'
            });
        }

        // Create new room
        const newRoom = {
            type,
            name,
            roomNumber,
            floor,
            capacity: capacity || 1,
            bedType,
            price,
            basePrice: basePrice || price,
            amenities: amenities || [],
            description,
            pictures: pictures || [],
            isAvailable: true,
            maintenanceMode: false,
            totalBookings: 0,
            averageRating: 0,
            reviewCount: 0
        };

        hotel.rooms.push(newRoom);
        await hotel.save();

        res.status(201).json({
            message: 'Room added successfully',
            room: newRoom
        });
    } catch (error) {
        console.error('Add Room Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update room
export const updateRoom = async (req, res) => {
    try {
        const { hotelId, roomId } = req.params;
        const updateData = req.body;

        // Remove fields that shouldn't be updated directly
        delete updateData.totalBookings;
        delete updateData.averageRating;
        delete updateData.reviewCount;

        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        const roomIndex = hotel.rooms.findIndex(room => room._id.toString() === roomId);
        if (roomIndex === -1) {
            return res.status(404).json({ message: 'Room not found' });
        }

        // Update room
        hotel.rooms[roomIndex] = {
            ...hotel.rooms[roomIndex].toObject(),
            ...updateData,
            updatedAt: new Date()
        };

        await hotel.save();

        res.status(200).json({
            message: 'Room updated successfully',
            room: hotel.rooms[roomIndex]
        });
    } catch (error) {
        console.error('Update Room Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete room
export const deleteRoom = async (req, res) => {
    try {
        const { hotelId, roomId } = req.params;

        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        const roomIndex = hotel.rooms.findIndex(room => room._id.toString() === roomId);
        if (roomIndex === -1) {
            return res.status(404).json({ message: 'Room not found' });
        }

        // Check if room has active bookings
        if (hotel.rooms[roomIndex].totalBookings > 0) {
            return res.status(400).json({
                message: 'Cannot delete room with existing bookings'
            });
        }

        hotel.rooms.splice(roomIndex, 1);
        await hotel.save();

        res.status(200).json({
            message: 'Room deleted successfully'
        });
    } catch (error) {
        console.error('Delete Room Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Toggle room availability
export const toggleRoomAvailability = async (req, res) => {
    try {
        const { hotelId, roomId } = req.params;
        const { isAvailable } = req.body;

        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        const room = hotel.rooms.id(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        room.isAvailable = isAvailable;
        room.updatedAt = new Date();
        await hotel.save();

        res.status(200).json({
            message: `Room ${isAvailable ? 'made available' : 'made unavailable'} successfully`,
            room
        });
    } catch (error) {
        console.error('Toggle Room Availability Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Toggle room maintenance mode
export const toggleRoomMaintenance = async (req, res) => {
    try {
        const { hotelId, roomId } = req.params;
        const { maintenanceMode } = req.body;

        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        const room = hotel.rooms.id(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        room.maintenanceMode = maintenanceMode;
        room.updatedAt = new Date();
        await hotel.save();

        res.status(200).json({
            message: `Room maintenance mode ${maintenanceMode ? 'enabled' : 'disabled'} successfully`,
            room
        });
    } catch (error) {
        console.error('Toggle Room Maintenance Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ========================================
// HOTEL ANALYTICS & METRICS
// ========================================

// Get hotel performance metrics
export const getHotelMetrics = async (req, res) => {
    try {
        const { hotelId } = req.params;
        const { period = '30d' } = req.query;

        // Calculate date range
        const endDate = new Date();
        let startDate = new Date();
        
        switch (period) {
            case '7d':
                startDate.setDate(endDate.getDate() - 7);
                break;
            case '30d':
                startDate.setDate(endDate.getDate() - 30);
                break;
            case '90d':
                startDate.setDate(endDate.getDate() - 90);
                break;
            case '1y':
                startDate.setFullYear(endDate.getFullYear() - 1);
                break;
            default:
                startDate.setDate(endDate.getDate() - 30);
        }

        // Get hotel metrics for the period
        const metrics = await HotelMetrics.find({
            hotelId,
            date: { $gte: startDate, $lte: endDate }
        }).sort({ date: 1 });

        // Get hotel details
        const hotel = await Hotel.findById(hotelId).select('name location rooms');
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        // Calculate summary metrics
        const summary = {
            totalViews: metrics.reduce((sum, m) => sum + m.totalViews, 0),
            totalBookings: metrics.reduce((sum, m) => sum + m.totalBookings, 0),
            totalRevenue: metrics.reduce((sum, m) => sum + m.totalRevenue, 0),
            averageRating: hotel.rating || 0,
            totalRooms: hotel.rooms.length,
            availableRooms: hotel.rooms.filter(r => r.isAvailable && !r.maintenanceMode).length
        };

        res.status(200).json({
            hotel: {
                name: hotel.name,
                location: hotel.location,
                totalRooms: hotel.rooms.length
            },
            period,
            startDate,
            endDate,
            summary,
            dailyMetrics: metrics
        });
    } catch (error) {
        console.error('Get Hotel Metrics Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get hotel statistics overview
export const getHotelStats = async (req, res) => {
    try {
        const { hotelId } = req.params;

        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        // Calculate room statistics
        const roomStats = {
            total: hotel.rooms.length,
            available: hotel.rooms.filter(r => r.isAvailable && !r.maintenanceMode).length,
            maintenance: hotel.rooms.filter(r => r.maintenanceMode).length,
            unavailable: hotel.rooms.filter(r => !r.isAvailable && !r.maintenanceMode).length,
            byType: {}
        };

        // Count rooms by type
        hotel.rooms.forEach(room => {
            if (!roomStats.byType[room.type]) {
                roomStats.byType[room.type] = 0;
            }
            roomStats.byType[room.type]++;
        });

        // Calculate pricing statistics
        const prices = hotel.rooms.map(r => r.price).filter(p => p > 0);
        const pricingStats = {
            averagePrice: prices.length > 0 ? (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2) : 0,
            minPrice: prices.length > 0 ? Math.min(...prices) : 0,
            maxPrice: prices.length > 0 ? Math.max(...prices) : 0,
            priceRange: hotel.price_range
        };

        res.status(200).json({
            hotel: {
                name: hotel.name,
                location: hotel.location,
                rating: hotel.rating,
                isActive: hotel.isActive,
                featured: hotel.featured,
                verified: hotel.verified
            },
            roomStats,
            pricingStats,
            businessMetrics: {
                totalBookings: hotel.totalBookings || 0,
                totalRevenue: hotel.totalRevenue || 0,
                averageRating: hotel.averageRating || 0,
                reviewCount: hotel.reviewCount || 0
            }
        });
    } catch (error) {
        console.error('Get Hotel Stats Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Bulk update hotel prices
export const bulkUpdatePrices = async (req, res) => {
    try {
        const { hotelId } = req.params;
        const { priceUpdates, percentageChange } = req.body;

        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        if (percentageChange) {
            // Apply percentage change to all rooms
            hotel.rooms.forEach(room => {
                room.price = Math.round(room.price * (1 + percentageChange / 100));
                room.updatedAt = new Date();
            });
        } else if (priceUpdates && Array.isArray(priceUpdates)) {
            // Apply specific price updates
            priceUpdates.forEach(update => {
                const room = hotel.rooms.id(update.roomId);
                if (room && update.newPrice) {
                    room.price = update.newPrice;
                    room.updatedAt = new Date();
                }
            });
        }

        hotel.updatedAt = new Date();
        await hotel.save();

        res.status(200).json({
            message: 'Prices updated successfully',
            updatedRooms: hotel.rooms.length
        });
    } catch (error) {
        console.error('Bulk Update Prices Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
