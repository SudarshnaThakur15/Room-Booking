import User from '../models/user.model.js';
import Booking from '../models/roomBooking.model.js';
import { UserBehavior } from '../models/analytics.model.js';

// ========================================
// ADMIN USER MANAGEMENT CONTROLLER
// ========================================

// Get all users with admin details
export const getAllUsers = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 20, 
            role, 
            status, 
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;
        const skip = (page - 1) * limit;

        let query = {};

        // Apply filters
        if (role) {
            query.role = role;
        }

        if (status !== undefined) {
            query.isActive = status === 'true';
        }

        if (search) {
            query.$or = [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } }
            ];
        }

        // Determine sort order
        const sortDirection = sortOrder === 'asc' ? 1 : -1;
        const sortOptions = {};
        sortOptions[sortBy] = sortDirection;

        // Get users with populated data
        const users = await User.find(query)
            .select('-password') // Exclude password
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await User.countDocuments(query);

        res.status(200).json({
            users,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(total / limit),
                totalUsers: total
            }
        });
    } catch (error) {
        console.error('Get All Users Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get single user with detailed admin info
export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId)
            .select('-password') // Exclude password
            .populate('bookings', 'startDate endDate status totalAmount hotelId')
            .populate('favoriteHotels', 'name location rating');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Get User Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create new user (Admin only)
export const createUser = async (req, res) => {
    try {
        const {
            username, email, password, firstName, lastName,
            role = 'customer', phone, address, dateOfBirth
        } = req.body;

        // Validate required fields
        if (!username || !email || !password) {
            return res.status(400).json({
                message: 'Username, email, and password are required'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'Username or email already exists'
            });
        }

        // Create new user
        const newUser = new User({
            username,
            email,
            password, // Will be hashed by pre-save hook
            firstName,
            lastName,
            role,
            phone,
            address,
            dateOfBirth,
            isActive: true,
            emailVerified: false
        });

        await newUser.save();

        // Remove password from response
        const userResponse = newUser.toObject();
        delete userResponse.password;

        res.status(201).json({
            message: 'User created successfully',
            user: userResponse
        });
    } catch (error) {
        console.error('Create User Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user (Admin only)
export const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const updateData = req.body;

        // Remove fields that shouldn't be updated directly
        delete updateData.password; // Handle password separately
        delete updateData.createdAt;
        delete updateData.totalBookings;
        delete updateData.totalSpent;
        delete updateData.averageRating;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user
        Object.assign(user, updateData);
        user.updatedAt = new Date();
        await user.save();

        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json({
            message: 'User updated successfully',
            user: userResponse
        });
    } catch (error) {
        console.error('Update User Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user password (Admin only)
export const updateUserPassword = async (req, res) => {
    try {
        const { userId } = req.params;
        const { newPassword } = req.body;

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({
                message: 'New password must be at least 6 characters long'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update password (will be hashed by pre-save hook)
        user.password = newPassword;
        user.updatedAt = new Date();
        await user.save();

        res.status(200).json({
            message: 'User password updated successfully'
        });
    } catch (error) {
        console.error('Update User Password Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete user (Admin only) - Soft delete
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user has active bookings
        const activeBookings = await Booking.countDocuments({
            userId,
            status: { $in: ['confirmed', 'checked_in', 'pending'] }
        });

        if (activeBookings > 0) {
            return res.status(400).json({
                message: 'Cannot delete user with active bookings'
            });
        }

        // Soft delete - mark as inactive
        user.isActive = false;
        user.updatedAt = new Date();
        await user.save();

        res.status(200).json({
            message: 'User deleted successfully (marked as inactive)'
        });
    } catch (error) {
        console.error('Delete User Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Toggle user status (active/inactive)
export const toggleUserStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const { isActive } = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            { 
                isActive: isActive,
                updatedAt: new Date()
            },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
            user
        });
    } catch (error) {
        console.error('Toggle User Status Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user role and permissions
export const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role, adminPermissions } = req.body;

        const validRoles = ['customer', 'admin'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                message: 'Invalid role. Must be: customer or admin'
            });
        }

        const updateData = { role, updatedAt: new Date() };

        // Set admin permissions based on role
        if (role === 'admin') {
            updateData.adminPermissions = {
                canManageHotels: true,
                canManageBookings: true,
                canViewAnalytics: true,
                canManageUsers: true,
                canViewReports: true
            };
        } else {
            updateData.adminPermissions = {
                canManageHotels: false,
                canManageBookings: false,
                canViewAnalytics: false,
                canManageUsers: false,
                canViewReports: false
            };
        }

        // Override with custom permissions if provided
        if (adminPermissions && role === 'admin') {
            updateData.adminPermissions = { ...updateData.adminPermissions, ...adminPermissions };
        }

        const user = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'User role and permissions updated successfully',
            user
        });
    } catch (error) {
        console.error('Update User Role Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user analytics and behavior
export const getUserAnalytics = async (req, res) => {
    try {
        const { userId } = req.params;
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

        // Get user details
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get user behavior data
        const behaviorData = await UserBehavior.find({
            userId,
            timestamp: { $gte: startDate, $lte: endDate }
        })
        .populate('hotelId', 'name location rating')
        .sort({ timestamp: -1 });

        // Get user bookings
        const bookings = await Booking.find({
            userId,
            createdAt: { $gte: startDate, $lte: endDate }
        })
        .populate('hotelId', 'name location')
        .sort({ createdAt: -1 });

        // Get behavior statistics
        const behaviorStats = await UserBehavior.aggregate([
            {
                $match: {
                    userId: user._id,
                    timestamp: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: '$action',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        // Get hotel interaction statistics
        const hotelInteractions = await UserBehavior.aggregate([
            {
                $match: {
                    userId: user._id,
                    timestamp: { $gte: startDate, $lte: endDate },
                    hotelId: { $exists: true, $ne: null }
                }
            },
            {
                $group: {
                    _id: '$hotelId',
                    totalInteractions: { $sum: 1 },
                    actions: { $addToSet: '$action' }
                }
            },
            {
                $lookup: {
                    from: 'hotels',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'hotelInfo'
                }
            },
            {
                $unwind: '$hotelInfo'
            },
            {
                $project: {
                    hotelId: '$_id',
                    hotelName: '$hotelInfo.name',
                    location: '$hotelInfo.location',
                    totalInteractions: 1,
                    actions: 1
                }
            },
            {
                $sort: { totalInteractions: -1 }
            }
        ]);

        // Get search behavior
        const searchBehavior = await UserBehavior.aggregate([
            {
                $match: {
                    userId: user._id,
                    timestamp: { $gte: startDate, $lte: endDate },
                    action: 'searched'
                }
            },
            {
                $group: {
                    _id: '$searchQuery',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 10
            }
        ]);

        // Calculate engagement metrics
        const totalActions = behaviorData.length;
        const totalBookings = bookings.length;
        const confirmedBookings = bookings.filter(b => 
            ['confirmed', 'checked_in', 'checked_out', 'completed'].includes(b.status)
        ).length;
        const totalSpent = confirmedBookings > 0 ? 
            bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0) : 0;

        res.status(200).json({
            period,
            startDate,
            endDate,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                isActive: user.isActive,
                lastActive: user.lastActive,
                createdAt: user.createdAt
            },
            summary: {
                totalActions,
                totalBookings,
                confirmedBookings,
                totalSpent,
                averageOrderValue: confirmedBookings > 0 ? (totalSpent / confirmedBookings).toFixed(2) : 0
            },
            behaviorStats,
            hotelInteractions,
            searchBehavior,
            recentActivity: behaviorData.slice(0, 20),
            recentBookings: bookings.slice(0, 10)
        });
    } catch (error) {
        console.error('Get User Analytics Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user preferences and recommendations
export const getUserPreferences = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId)
            .select('preferences favoriteHotels activities')
            .populate('favoriteHotels', 'name location rating amenities price_range');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Analyze user preferences from activities
        const activityPreferences = await UserBehavior.aggregate([
            {
                $match: { userId: user._id }
            },
            {
                $group: {
                    _id: '$hotelId',
                    totalInteractions: { $sum: 1 },
                    lastInteraction: { $max: '$timestamp' },
                    actions: { $addToSet: '$action' }
                }
            },
            {
                $lookup: {
                    from: 'hotels',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'hotelInfo'
                }
            },
            {
                $unwind: '$hotelInfo'
            },
            {
                $project: {
                    hotelId: '$_id',
                    hotelName: '$hotelInfo.name',
                    location: '$hotelInfo.location',
                    rating: '$hotelInfo.rating',
                    amenities: '$hotelInfo.amenities',
                    priceRange: '$hotelInfo.price_range',
                    totalInteractions: 1,
                    lastInteraction: 1,
                    actions: 1
                }
            },
            {
                $sort: { totalInteractions: -1 }
            },
            {
                $limit: 20
            }
        ]);

        // Get price preference analysis
        const pricePreferences = await UserBehavior.aggregate([
            {
                $match: { 
                    userId: user._id,
                    action: { $in: ['viewed_hotel', 'searched'] }
                }
            },
            {
                $lookup: {
                    from: 'hotels',
                    localField: 'hotelId',
                    foreignField: '_id',
                    as: 'hotelInfo'
                }
            },
            {
                $unwind: '$hotelInfo'
            },
            {
                $group: {
                    _id: null,
                    averagePrice: { $avg: '$hotelInfo.basePrice' },
                    minPrice: { $min: '$hotelInfo.basePrice' },
                    maxPrice: { $max: '$hotelInfo.basePrice' }
                }
            }
        ]);

        // Get location preferences
        const locationPreferences = await UserBehavior.aggregate([
            {
                $match: { 
                    userId: user._id,
                    action: { $in: ['viewed_hotel', 'searched'] }
                }
            },
            {
                $lookup: {
                    from: 'hotels',
                    localField: 'hotelId',
                    foreignField: '_id',
                    as: 'hotelInfo'
                }
            },
            {
                $unwind: '$hotelInfo'
            },
            {
                $group: {
                    _id: '$hotelInfo.location',
                    visitCount: { $sum: 1 }
                }
            },
            {
                $sort: { visitCount: -1 }
            },
            {
                $limit: 10
            }
        ]);

        res.status(200).json({
            user: {
                id: user._id,
                preferences: user.preferences,
                favoriteHotels: user.favoriteHotels
            },
            activityPreferences,
            pricePreferences: pricePreferences[0] || {
                averagePrice: 0,
                minPrice: 0,
                maxPrice: 0
            },
            locationPreferences,
            recommendationInsights: {
                totalInteractions: activityPreferences.length,
                topHotels: activityPreferences.slice(0, 5),
                preferredLocations: locationPreferences.slice(0, 5)
            }
        });
    } catch (error) {
        console.error('Get User Preferences Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Bulk user operations
export const bulkUserOperations = async (req, res) => {
    try {
        const { operation, userIds, data } = req.body;

        if (!operation || !userIds || !Array.isArray(userIds)) {
            return res.status(400).json({
                message: 'Operation, userIds array, and data are required'
            });
        }

        let updateData = {};
        let message = '';

        switch (operation) {
            case 'activate':
                updateData = { isActive: true, updatedAt: new Date() };
                message = 'Users activated successfully';
                break;
            case 'deactivate':
                updateData = { isActive: false, updatedAt: new Date() };
                message = 'Users deactivated successfully';
                break;
            case 'changeRole':
                if (!data.role) {
                    return res.status(400).json({
                        message: 'Role is required for changeRole operation'
                    });
                }
                updateData = { 
                    role: data.role, 
                    updatedAt: new Date() 
                };
                message = 'User roles updated successfully';
                break;
            case 'updatePermissions':
                if (!data.adminPermissions) {
                    return res.status(400).json({
                        message: 'Admin permissions are required for updatePermissions operation'
                    });
                }
                updateData = { 
                    adminPermissions: data.adminPermissions, 
                    updatedAt: new Date() 
                };
                message = 'User permissions updated successfully';
                break;
            default:
                return res.status(400).json({
                    message: 'Invalid operation. Supported: activate, deactivate, changeRole, updatePermissions'
                });
        }

        const result = await User.updateMany(
            { _id: { $in: userIds } },
            updateData
        );

        res.status(200).json({
            message,
            updatedCount: result.modifiedCount,
            totalRequested: userIds.length
        });
    } catch (error) {
        console.error('Bulk User Operations Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Export user data
export const exportUsers = async (req, res) => {
    try {
        const { format = 'json', role, status, startDate, endDate } = req.query;

        let query = {};

        if (role) {
            query.role = role;
        }

        if (status !== undefined) {
            query.isActive = status === 'true';
        }

        if (startDate && endDate) {
            query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 });

        if (format === 'csv') {
            // Convert to CSV format
            const csvData = users.map(user => ({
                'User ID': user._id,
                'Username': user.username,
                'Email': user.email,
                'First Name': user.firstName || '',
                'Last Name': user.lastName || '',
                'Role': user.role,
                'Status': user.isActive ? 'Active' : 'Inactive',
                'Phone': user.phone || '',
                'Address': user.address || '',
                'Date of Birth': user.dateOfBirth || '',
                'Total Bookings': user.totalBookings || 0,
                'Total Spent': user.totalSpent || 0,
                'Average Rating': user.averageRating || 0,
                'Last Active': user.lastActive || '',
                'Created Date': user.createdAt
            }));

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
            
            // Simple CSV conversion
            const csvString = csvData.map(row => 
                Object.values(row).map(value => `"${value}"`).join(',')
            ).join('\n');
            
            res.status(200).send(csvString);
        } else {
            // Return JSON format
            res.status(200).json({
                message: 'Users exported successfully',
                count: users.length,
                users
            });
        }
    } catch (error) {
        console.error('Export Users Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};






