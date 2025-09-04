import { 
    UserBehavior, 
    HotelMetrics, 
    BusinessAnalytics, 
    SearchAnalytics,
    Recommendation 
} from '../models/analytics.model.js';
import User from '../models/user.model.js';
import Hotel from '../models/hotel.model.js';
import Booking from '../models/roomBooking.model.js';

// ========================================
// ADMIN ANALYTICS CONTROLLER
// ========================================

// Get overall business analytics dashboard
export const getBusinessDashboard = async (req, res) => {
    try {
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

        // Get user statistics
        const userStats = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: null,
                    newUsers: { $sum: 1 },
                    totalUsers: { $sum: 1 }
                }
            }
        ]);

        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({
            lastActive: { $gte: startDate }
        });

        // Get booking statistics
        const bookingStats = await Booking.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    revenue: { $sum: '$totalAmount' }
                }
            }
        ]);

        const totalBookings = await Booking.countDocuments({
            createdAt: { $gte: startDate, $lte: endDate }
        });

        const confirmedBookings = await Booking.countDocuments({
            createdAt: { $gte: startDate, $lte: endDate },
            status: { $in: ['confirmed', 'checked_in', 'checked_out', 'completed'] }
        });

        const totalRevenue = await Booking.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate },
                    status: { $in: ['confirmed', 'checked_in', 'checked_out', 'completed'] }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$totalAmount' }
                }
            }
        ]);

        // Get hotel statistics
        const hotelStats = await Hotel.aggregate([
            {
                $group: {
                    _id: null,
                    totalHotels: { $sum: 1 },
                    activeHotels: { $sum: { $cond: ['$isActive', 1, 0] } },
                    featuredHotels: { $sum: { $cond: ['$featured', 1, 0] } },
                    verifiedHotels: { $sum: { $cond: ['$verified', 1, 0] } }
                }
            }
        ]);

        // Get user behavior statistics
        const behaviorStats = await UserBehavior.aggregate([
            {
                $match: {
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

        // Get search analytics
        const searchStats = await SearchAnalytics.aggregate([
            {
                $match: {
                    timestamp: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSearches: { $sum: 1 },
                    uniqueUsers: { $addToSet: '$userId' }
                }
            }
        ]);

        // Calculate conversion rate
        const conversionRate = totalBookings > 0 ? (confirmedBookings / totalBookings * 100).toFixed(2) : 0;

        // Calculate average order value
        const averageOrderValue = confirmedBookings > 0 ? (totalRevenue[0]?.total || 0) / confirmedBookings : 0;

        res.status(200).json({
            period,
            startDate,
            endDate,
            overview: {
                totalUsers,
                activeUsers,
                newUsers: userStats[0]?.newUsers || 0,
                totalBookings,
                confirmedBookings,
                totalRevenue: totalRevenue[0]?.total || 0,
                conversionRate: parseFloat(conversionRate),
                averageOrderValue: parseFloat(averageOrderValue.toFixed(2))
            },
            hotels: hotelStats[0] || {
                totalHotels: 0,
                activeHotels: 0,
                featuredHotels: 0,
                verifiedHotels: 0
            },
            userBehavior: behaviorStats,
            searchAnalytics: {
                totalSearches: searchStats[0]?.totalSearches || 0,
                uniqueUsers: searchStats[0]?.uniqueUsers?.length || 0
            },
            bookingBreakdown: bookingStats
        });
    } catch (error) {
        console.error('Get Business Dashboard Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user behavior analytics
export const getUserBehaviorAnalytics = async (req, res) => {
    try {
        const { period = '30d', action, userId, hotelId } = req.query;

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

        let query = {
            timestamp: { $gte: startDate, $lte: endDate }
        };

        if (action) {
            query.action = action;
        }

        if (userId) {
            query.userId = userId;
        }

        if (hotelId) {
            query.hotelId = hotelId;
        }

        // Get behavior data
        const behaviorData = await UserBehavior.find(query)
            .populate('userId', 'username email firstName lastName')
            .populate('hotelId', 'name location')
            .sort({ timestamp: -1 })
            .limit(1000);

        // Get action distribution
        const actionDistribution = await UserBehavior.aggregate([
            { $match: query },
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

        // Get hourly activity pattern
        const hourlyPattern = await UserBehavior.aggregate([
            { $match: query },
            {
                $group: {
                    _id: { $hour: '$timestamp' },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Get daily activity pattern
        const dailyPattern = await UserBehavior.aggregate([
            { $match: query },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Get top performing hotels by views
        const topHotels = await UserBehavior.aggregate([
            {
                $match: {
                    ...query,
                    action: 'viewed_hotel'
                }
            },
            {
                $group: {
                    _id: '$hotelId',
                    viewCount: { $sum: 1 }
                }
            },
            {
                $sort: { viewCount: -1 }
            },
            {
                $limit: 10
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
                    viewCount: 1
                }
            }
        ]);

        res.status(200).json({
            period,
            startDate,
            endDate,
            filters: { action, userId, hotelId },
            summary: {
                totalActions: behaviorData.length,
                uniqueUsers: new Set(behaviorData.map(b => b.userId?._id?.toString())).size,
                uniqueHotels: new Set(behaviorData.map(b => b.hotelId?._id?.toString())).size
            },
            actionDistribution,
            hourlyPattern,
            dailyPattern,
            topHotels,
            recentActivity: behaviorData.slice(0, 50)
        });
    } catch (error) {
        console.error('Get User Behavior Analytics Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get hotel performance analytics
export const getHotelPerformanceAnalytics = async (req, res) => {
    try {
        const { period = '30d', hotelId } = req.query;

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

        let query = {
            date: { $gte: startDate, $lte: endDate }
        };

        if (hotelId) {
            query.hotelId = hotelId;
        }

        // Get hotel metrics
        const hotelMetrics = await HotelMetrics.find(query)
            .populate('hotelId', 'name location rating')
            .sort({ date: 1 });

        // Get performance summary
        const performanceSummary = await HotelMetrics.aggregate([
            { $match: query },
            {
                $group: {
                    _id: '$hotelId',
                    totalViews: { $sum: '$totalViews' },
                    totalBookings: { $sum: '$totalBookings' },
                    totalRevenue: { $sum: '$totalRevenue' },
                    averageRating: { $avg: '$averageRating' },
                    totalRooms: { $max: '$totalRooms' },
                    averageOccupancy: { $avg: '$occupancyRate' }
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
                    totalViews: 1,
                    totalBookings: 1,
                    totalRevenue: 1,
                    averageRating: { $round: ['$averageRating', 2] },
                    totalRooms: 1,
                    averageOccupancy: { $round: ['$averageOccupancy', 2] },
                    conversionRate: {
                        $cond: [
                            { $gt: ['$totalViews', 0] },
                            { $multiply: [{ $divide: ['$totalBookings', '$totalViews'] }, 100] },
                            0
                        ]
                    }
                }
            },
            {
                $sort: { totalRevenue: -1 }
            }
        ]);

        // Get top performing hotels
        const topHotels = performanceSummary.slice(0, 10);

        // Get revenue trends
        const revenueTrends = await HotelMetrics.aggregate([
            { $match: query },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    totalRevenue: { $sum: '$totalRevenue' },
                    totalBookings: { $sum: '$totalBookings' },
                    totalViews: { $sum: '$totalViews' }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Get room type performance
        const roomTypePerformance = await Hotel.aggregate([
            {
                $unwind: '$rooms'
            },
            {
                $group: {
                    _id: '$rooms.type',
                    totalRooms: { $sum: 1 },
                    averagePrice: { $avg: '$rooms.price' },
                    totalBookings: { $sum: '$rooms.totalBookings' },
                    averageRating: { $avg: '$rooms.averageRating' }
                }
            },
            {
                $project: {
                    roomType: '$_id',
                    totalRooms: 1,
                    averagePrice: { $round: ['$averagePrice', 2] },
                    totalBookings: 1,
                    averageRating: { $round: ['$averageRating', 2] }
                }
            },
            {
                $sort: { totalBookings: -1 }
            }
        ]);

        res.status(200).json({
            period,
            startDate,
            endDate,
            hotelId,
            summary: {
                totalHotels: performanceSummary.length,
                totalViews: performanceSummary.reduce((sum, h) => sum + h.totalViews, 0),
                totalBookings: performanceSummary.reduce((sum, h) => sum + h.totalBookings, 0),
                totalRevenue: performanceSummary.reduce((sum, h) => sum + h.totalRevenue, 0)
            },
            performanceSummary,
            topHotels,
            revenueTrends,
            roomTypePerformance,
            dailyMetrics: hotelMetrics
        });
    } catch (error) {
        console.error('Get Hotel Performance Analytics Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get search analytics
export const getSearchAnalytics = async (req, res) => {
    try {
        const { period = '30d', searchQuery } = req.query;

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

        let query = {
            timestamp: { $gte: startDate, $lte: endDate }
        };

        if (searchQuery) {
            query.searchQuery = { $regex: searchQuery, $options: 'i' };
        }

        // Get search data
        const searchData = await SearchAnalytics.find(query)
            .populate('userId', 'username email firstName lastName')
            .populate('hotelId', 'name location')
            .sort({ timestamp: -1 })
            .limit(1000);

        // Get search query distribution
        const queryDistribution = await SearchAnalytics.aggregate([
            { $match: query },
            {
                $group: {
                    _id: '$searchQuery',
                    count: { $sum: 1 },
                    uniqueUsers: { $addToSet: '$userId' },
                    averageResults: { $avg: '$resultsCount' }
                }
            },
            {
                $project: {
                    searchQuery: '$_id',
                    count: 1,
                    uniqueUsers: { $size: '$uniqueUsers' },
                    averageResults: { $round: ['$averageResults', 2] }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 20
            }
        ]);

        // Get search trends over time
        const searchTrends = await SearchAnalytics.aggregate([
            { $match: query },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    totalSearches: { $sum: 1 },
                    uniqueUsers: { $addToSet: '$userId' },
                    averageResults: { $avg: '$resultsCount' }
                }
            },
            {
                $project: {
                    date: '$_id',
                    totalSearches: 1,
                    uniqueUsers: { $size: '$uniqueUsers' },
                    averageResults: { $round: ['$averageResults', 2] }
                }
            },
            {
                $sort: { date: 1 }
            }
        ]);

        // Get clicked results analysis
        const clickedResults = await SearchAnalytics.aggregate([
            { $match: query },
            {
                $unwind: '$clickedResults'
            },
            {
                $group: {
                    _id: '$clickedResults.hotelId',
                    clickCount: { $sum: 1 },
                    averagePosition: { $avg: '$clickedResults.position' }
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
                    clickCount: 1,
                    averagePosition: { $round: ['$averagePosition', 2] }
                }
            },
            {
                $sort: { clickCount: -1 }
            },
            {
                $limit: 10
            }
        ]);

        // Get filter usage
        const filterUsage = await SearchAnalytics.aggregate([
            { $match: query },
            {
                $group: {
                    _id: null,
                    totalSearches: { $sum: 1 },
                    searchesWithFilters: {
                        $sum: {
                            $cond: [
                                { $gt: [{ $size: { $objectToArray: '$filters' } }, 0] },
                                1,
                                0
                            ]
                        }
                    }
                }
            }
        ]);

        res.status(200).json({
            period,
            startDate,
            endDate,
            searchQuery,
            summary: {
                totalSearches: searchData.length,
                uniqueUsers: new Set(searchData.map(s => s.userId?._id?.toString())).size,
                uniqueQueries: new Set(searchData.map(s => s.searchQuery).filter(Boolean)).size
            },
            queryDistribution,
            searchTrends,
            clickedResults,
            filterUsage: filterUsage[0] || {
                totalSearches: 0,
                searchesWithFilters: 0
            },
            recentSearches: searchData.slice(0, 50)
        });
    } catch (error) {
        console.error('Get Search Analytics Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get recommendation system analytics
export const getRecommendationAnalytics = async (req, res) => {
    try {
        const { period = '30d', algorithm, userId } = req.query;

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

        let query = {
            generatedAt: { $gte: startDate, $lte: endDate }
        };

        if (algorithm) {
            query.algorithm = algorithm;
        }

        if (userId) {
            query.userId = userId;
        }

        // Get recommendation data
        const recommendations = await Recommendation.find(query)
            .populate('userId', 'username email firstName lastName')
            .populate('hotelId', 'name location rating')
            .sort({ generatedAt: -1 })
            .limit(1000);

        // Get algorithm performance
        const algorithmPerformance = await Recommendation.aggregate([
            { $match: query },
            {
                $group: {
                    _id: '$algorithm',
                    totalRecommendations: { $sum: 1 },
                    totalClicks: { $sum: { $cond: ['$clicked', 1, 0] } },
                    averageScore: { $avg: '$score' }
                }
            },
            {
                $project: {
                    algorithm: '$_id',
                    totalRecommendations: 1,
                    totalClicks: 1,
                    averageScore: { $round: ['$averageScore', 4] },
                    clickThroughRate: {
                        $multiply: [
                            { $divide: ['$totalClicks', '$totalRecommendations'] },
                            100
                        ]
                    }
                }
            },
            {
                $sort: { clickThroughRate: -1 }
            }
        ]);

        // Get score distribution
        const scoreDistribution = await Recommendation.aggregate([
            { $match: query },
            {
                $bucket: {
                    groupBy: '$score',
                    boundaries: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
                    default: 'Other',
                    output: {
                        count: { $sum: 1 },
                        averageClickRate: {
                            $avg: { $cond: ['$clicked', 1, 0] }
                        }
                    }
                }
            }
        ]);

        // Get top recommended hotels
        const topRecommendedHotels = await Recommendation.aggregate([
            { $match: query },
            {
                $group: {
                    _id: '$hotelId',
                    totalRecommendations: { $sum: 1 },
                    totalClicks: { $sum: { $cond: ['$clicked', 1, 0] } },
                    averageScore: { $avg: '$score' }
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
                    totalRecommendations: 1,
                    totalClicks: 1,
                    averageScore: { $round: ['$averageScore', 4] },
                    clickThroughRate: {
                        $multiply: [
                            { $divide: ['$totalClicks', '$totalRecommendations'] },
                            100
                        ]
                    }
                }
            },
            {
                $sort: { totalRecommendations: -1 }
            },
            {
                $limit: 10
            }
        ]);

        // Get user engagement with recommendations
        const userEngagement = await Recommendation.aggregate([
            { $match: query },
            {
                $group: {
                    _id: '$userId',
                    totalRecommendations: { $sum: 1 },
                    totalClicks: { $sum: { $cond: ['$clicked', 1, 0] } },
                    averageScore: { $avg: '$score' }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userInfo'
                }
            },
            {
                $unwind: '$userInfo'
            },
            {
                $project: {
                    userId: '$_id',
                    userName: { $concat: ['$userInfo.firstName', ' ', '$userInfo.lastName'] },
                    userEmail: '$userInfo.email',
                    totalRecommendations: 1,
                    totalClicks: 1,
                    averageScore: { $round: ['$averageScore', 4] },
                    clickThroughRate: {
                        $multiply: [
                            { $divide: ['$totalClicks', '$totalRecommendations'] },
                            100
                        ]
                    }
                }
            },
            {
                $sort: { clickThroughRate: -1 }
            },
            {
                $limit: 20
            }
        ]);

        res.status(200).json({
            period,
            startDate,
            endDate,
            algorithm,
            userId,
            summary: {
                totalRecommendations: recommendations.length,
                uniqueUsers: new Set(recommendations.map(r => r.userId?._id?.toString())).size,
                uniqueHotels: new Set(recommendations.map(r => r.hotelId?._id?.toString())).size,
                totalClicks: recommendations.filter(r => r.clicked).length
            },
            algorithmPerformance,
            scoreDistribution,
            topRecommendedHotels,
            userEngagement,
            recentRecommendations: recommendations.slice(0, 50)
        });
    } catch (error) {
        console.error('Get Recommendation Analytics Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Export analytics data
export const exportAnalyticsData = async (req, res) => {
    try {
        const { 
            type, 
            format = 'json', 
            startDate, 
            endDate,
            limit = 1000 
        } = req.query;

        if (!type) {
            return res.status(400).json({ message: 'Analytics type is required' });
        }

        let query = {};
        if (startDate && endDate) {
            query.timestamp = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        let data;
        let filename;

        switch (type) {
            case 'user_behavior':
                data = await UserBehavior.find(query).limit(parseInt(limit));
                filename = 'user_behavior';
                break;
            case 'hotel_metrics':
                query.date = query.timestamp;
                delete query.timestamp;
                data = await HotelMetrics.find(query).limit(parseInt(limit));
                filename = 'hotel_metrics';
                break;
            case 'search_analytics':
                data = await SearchAnalytics.find(query).limit(parseInt(limit));
                filename = 'search_analytics';
                break;
            case 'recommendations':
                query.generatedAt = query.timestamp;
                delete query.timestamp;
                data = await Recommendation.find(query).limit(parseInt(limit));
                filename = 'recommendations';
                break;
            default:
                return res.status(400).json({ message: 'Invalid analytics type' });
        }

        if (format === 'csv') {
            // Convert to CSV format
            const csvData = data.map(item => {
                const cleanItem = JSON.parse(JSON.stringify(item));
                delete cleanItem._id;
                delete cleanItem.__v;
                return cleanItem;
            });

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename=${filename}.csv`);
            
            // Simple CSV conversion
            const csvString = csvData.map(row => 
                Object.values(row).map(value => `"${value}"`).join(',')
            ).join('\n');
            
            res.status(200).send(csvString);
        } else {
            // Return JSON format
            res.status(200).json({
                message: 'Analytics data exported successfully',
                type,
                count: data.length,
                data
            });
        }
    } catch (error) {
        console.error('Export Analytics Data Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
