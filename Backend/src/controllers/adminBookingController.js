import Booking from '../models/roomBooking.model.js';
import Hotel from '../models/hotel.model.js';
import User from '../models/user.model.js';
import { UserBehavior, BusinessAnalytics } from '../models/analytics.model.js';

// ========================================
// ADMIN BOOKING MANAGEMENT CONTROLLER
// ========================================

// Get all bookings with admin details
export const getAllBookings = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 20, 
            status, 
            hotelId, 
            userId, 
            startDate, 
            endDate,
            search,
            priority,
            assignedTo
        } = req.query;
        const skip = (page - 1) * limit;

        let query = {};

        // Apply filters
        if (status) {
            query.status = status;
        }

        if (hotelId) {
            query.hotelId = hotelId;
        }

        if (userId) {
            query.userId = userId;
        }

        if (startDate && endDate) {
            query.startDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        if (priority) {
            query.priority = priority;
        }

        if (assignedTo) {
            query.assignedTo = assignedTo;
        }

        if (search) {
            query.$or = [
                { 'guestInfo.firstName': { $regex: search, $options: 'i' } },
                { 'guestInfo.lastName': { $regex: search, $options: 'i' } },
                { 'guestInfo.email': { $regex: search, $options: 'i' } },
                { specialRequests: { $regex: search, $options: 'i' } },
                { notes: { $regex: search, $options: 'i' } }
            ];
        }

        // Get bookings with populated data
        const bookings = await Booking.find(query)
            .populate('userId', 'username email firstName lastName')
            .populate('hotelId', 'name location')
            .populate('assignedTo', 'username email firstName lastName')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Booking.countDocuments(query);

        res.status(200).json({
            bookings,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(total / limit),
                totalBookings: total
            }
        });
    } catch (error) {
        console.error('Get All Bookings Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get single booking with detailed admin info
export const getBookingById = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const booking = await Booking.findById(bookingId)
            .populate('userId', 'username email firstName lastName phone')
            .populate('hotelId', 'name location contact')
            .populate('assignedTo', 'username email firstName lastName');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json(booking);
    } catch (error) {
        console.error('Get Booking Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update booking status (Admin only)
export const updateBookingStatus = async (req, res) => {
    try {
        const adminId = req.user.userId;
        const { bookingId } = req.params;
        const { status, notes, assignedTo } = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Update status and related fields
        const updateData = { status, updatedAt: new Date() };

        if (notes) {
            updateData.notes = notes;
        }

        if (assignedTo) {
            updateData.assignedTo = assignedTo;
        }

        // Set specific timestamps based on status
        switch (status) {
            case 'confirmed':
                updateData.confirmedAt = new Date();
                break;
            case 'checked_in':
                updateData.checkedInAt = new Date();
                break;
            case 'checked_out':
                updateData.checkedOutAt = new Date();
                break;
            case 'cancelled':
                updateData.cancellation = {
                    ...booking.cancellation,
                    cancelledAt: new Date(),
                    cancelledBy: adminId
                };
                break;
        }

        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            updateData,
            { new: true, runValidators: true }
        ).populate('userId', 'username email firstName lastName')
         .populate('hotelId', 'name location')
         .populate('assignedTo', 'username email firstName lastName');

        // Track admin activity
        await UserBehavior.create({
            userId: adminId,
            hotelId: booking.hotelId,
            roomId: booking.roomId,
            action: 'updated_booking_status',
            metadata: {
                oldStatus: booking.status,
                newStatus: status,
                bookingId: bookingId
            }
        });

        res.status(200).json({
            message: 'Booking status updated successfully',
            booking: updatedBooking
        });
    } catch (error) {
        console.error('Update Booking Status Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Assign booking to admin
export const assignBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { assignedTo } = req.body;

        // Verify admin exists
        const admin = await User.findById(assignedTo);
        if (!admin || admin.role !== 'admin') {
            return res.status(400).json({ message: 'Invalid admin user' });
        }

        const booking = await Booking.findByIdAndUpdate(
            bookingId,
            { 
                assignedTo,
                updatedAt: new Date()
            },
            { new: true, runValidators: true }
        ).populate('userId', 'username email firstName lastName')
         .populate('hotelId', 'name location')
         .populate('assignedTo', 'username email firstName lastName');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json({
            message: 'Booking assigned successfully',
            booking
        });
    } catch (error) {
        console.error('Assign Booking Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update booking priority
export const updateBookingPriority = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { priority } = req.body;

        const validPriorities = ['low', 'normal', 'high', 'urgent'];
        if (!validPriorities.includes(priority)) {
            return res.status(400).json({ 
                message: 'Invalid priority. Must be: low, normal, high, or urgent' 
            });
        }

        const booking = await Booking.findByIdAndUpdate(
            bookingId,
            { 
                priority,
                updatedAt: new Date()
            },
            { new: true, runValidators: true }
        ).populate('userId', 'username email firstName lastName')
         .populate('hotelId', 'name location')
         .populate('assignedTo', 'username email firstName lastName');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json({
            message: 'Booking priority updated successfully',
            booking
        });
    } catch (error) {
        console.error('Update Booking Priority Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Process booking cancellation
export const cancelBooking = async (req, res) => {
    try {
        const adminId = req.user.userId;
        const { bookingId } = req.params;
        const { reason, refundAmount, refundStatus = 'pending' } = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.status === 'cancelled') {
            return res.status(400).json({ message: 'Booking is already cancelled' });
        }

        // Update booking status and cancellation info
        const updateData = {
            status: 'cancelled',
            updatedAt: new Date(),
            cancellation: {
                cancelledAt: new Date(),
                cancelledBy: adminId,
                reason: reason || 'Cancelled by admin',
                refundAmount: refundAmount || booking.totalAmount,
                refundStatus
            }
        };

        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            updateData,
            { new: true, runValidators: true }
        ).populate('userId', 'username email firstName lastName')
         .populate('hotelId', 'name location')
         .populate('assignedTo', 'username email firstName lastName');

        // Track cancellation activity
        await UserBehavior.create({
            userId: adminId,
            hotelId: booking.hotelId,
            roomId: booking.roomId,
            action: 'cancelled_booking',
            metadata: {
                reason,
                refundAmount,
                bookingId: bookingId
            }
        });

        res.status(200).json({
            message: 'Booking cancelled successfully',
            booking: updatedBooking
        });
    } catch (error) {
        console.error('Cancel Booking Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Process refund
export const processRefund = async (req, res) => {
    try {
        const adminId = req.user.userId;
        const { bookingId } = req.params;
        const { refundStatus, refundNotes } = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.status !== 'cancelled') {
            return res.status(400).json({ message: 'Only cancelled bookings can be refunded' });
        }

        // Update refund status
        const updateData = {
            'cancellation.refundStatus': refundStatus,
            'cancellation.refundedAt': refundStatus === 'completed' ? new Date() : undefined,
            updatedAt: new Date()
        };

        if (refundNotes) {
            updateData['cancellation.refundNotes'] = refundNotes;
        }

        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            updateData,
            { new: true, runValidators: true }
        ).populate('userId', 'username email firstName lastName')
         .populate('hotelId', 'name location')
         .populate('assignedTo', 'username email firstName lastName');

        res.status(200).json({
            message: 'Refund processed successfully',
            booking: updatedBooking
        });
    } catch (error) {
        console.error('Process Refund Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Add admin notes to booking
export const addBookingNotes = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { notes } = req.body;

        if (!notes || notes.trim() === '') {
            return res.status(400).json({ message: 'Notes cannot be empty' });
        }

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Append new notes to existing notes
        const updatedNotes = booking.notes 
            ? `${booking.notes}\n\n[${new Date().toISOString()}] ${notes}`
            : `[${new Date().toISOString()}] ${notes}`;

        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            { 
                notes: updatedNotes,
                updatedAt: new Date()
            },
            { new: true, runValidators: true }
        ).populate('userId', 'username email firstName lastName')
         .populate('hotelId', 'name location')
         .populate('assignedTo', 'username email firstName lastName');

        res.status(200).json({
            message: 'Notes added successfully',
            booking: updatedBooking
        });
    } catch (error) {
        console.error('Add Booking Notes Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ========================================
// BOOKING ANALYTICS & REPORTING
// ========================================

// Get booking statistics overview
export const getBookingStats = async (req, res) => {
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

        // Get booking statistics
        const stats = await Booking.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalRevenue: { $sum: '$totalAmount' },
                    averageAmount: { $avg: '$totalAmount' }
                }
            }
        ]);

        // Get total counts
        const totalBookings = await Booking.countDocuments({
            createdAt: { $gte: startDate, $lte: endDate }
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

        // Get status distribution
        const statusDistribution = {};
        stats.forEach(stat => {
            statusDistribution[stat._id] = {
                count: stat.count,
                percentage: ((stat.count / totalBookings) * 100).toFixed(2),
                revenue: stat.totalRevenue || 0,
                averageAmount: stat.averageAmount || 0
            };
        });

        res.status(200).json({
            period,
            startDate,
            endDate,
            summary: {
                totalBookings,
                totalRevenue: totalRevenue[0]?.total || 0,
                averageRevenue: totalBookings > 0 ? (totalRevenue[0]?.total || 0) / totalBookings : 0
            },
            statusDistribution,
            detailedStats: stats
        });
    } catch (error) {
        console.error('Get Booking Stats Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get revenue analytics
export const getRevenueAnalytics = async (req, res) => {
    try {
        const { period = '30d', groupBy = 'day' } = req.query;

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

        // Determine grouping format
        let dateFormat;
        switch (groupBy) {
            case 'hour':
                dateFormat = { $dateToString: { format: "%Y-%m-%d %H:00", date: "$createdAt" } };
                break;
            case 'day':
                dateFormat = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
                break;
            case 'week':
                dateFormat = { $dateToString: { format: "%Y-W%U", date: "$createdAt" } };
                break;
            case 'month':
                dateFormat = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
                break;
            default:
                dateFormat = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
        }

        // Get revenue data
        const revenueData = await Booking.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate },
                    status: { $in: ['confirmed', 'checked_in', 'checked_out', 'completed'] }
                }
            },
            {
                $group: {
                    _id: dateFormat,
                    totalRevenue: { $sum: '$totalAmount' },
                    totalBookings: { $sum: 1 },
                    averageAmount: { $avg: '$totalAmount' }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Get cancellation data
        const cancellationData = await Booking.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate },
                    status: 'cancelled'
                }
            },
            {
                $group: {
                    _id: dateFormat,
                    cancelledBookings: { $sum: 1 },
                    cancelledRevenue: { $sum: '$totalAmount' }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        res.status(200).json({
            period,
            groupBy,
            startDate,
            endDate,
            revenueData,
            cancellationData
        });
    } catch (error) {
        console.error('Get Revenue Analytics Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get admin performance metrics
export const getAdminPerformance = async (req, res) => {
    try {
        const { period = '30d' } = req.query;

        // Calculate date range
        const endDate = new Date();
        let startDate = new Date();
        startDate.setDate(endDate.getDate() - 30);

        // Get admin performance data
        const adminPerformance = await Booking.aggregate([
            {
                $match: {
                    updatedAt: { $gte: startDate, $lte: endDate },
                    assignedTo: { $exists: true, $ne: null }
                }
            },
            {
                $group: {
                    _id: '$assignedTo',
                    totalBookings: { $sum: 1 },
                    confirmedBookings: {
                        $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] }
                    },
                    cancelledBookings: {
                        $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
                    },
                    totalRevenue: {
                        $sum: { $cond: [{ $in: ['$status', ['confirmed', 'checked_in', 'checked_out', 'completed']] }, '$totalAmount', 0] }
                    }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'adminInfo'
                }
            },
            {
                $unwind: '$adminInfo'
            },
            {
                $project: {
                    adminId: '$_id',
                    adminName: { $concat: ['$adminInfo.firstName', ' ', '$adminInfo.lastName'] },
                    adminEmail: '$adminInfo.email',
                    totalBookings: 1,
                    confirmedBookings: 1,
                    cancelledBookings: 1,
                    totalRevenue: 1,
                    confirmationRate: {
                        $multiply: [
                            { $divide: ['$confirmedBookings', '$totalBookings'] },
                            100
                        ]
                    }
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
            adminPerformance
        });
    } catch (error) {
        console.error('Get Admin Performance Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Export booking data for reporting
export const exportBookings = async (req, res) => {
    try {
        const { format = 'json', startDate, endDate, status } = req.query;

        let query = {};

        if (startDate && endDate) {
            query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        if (status) {
            query.status = status;
        }

        const bookings = await Booking.find(query)
            .populate('userId', 'username email firstName lastName')
            .populate('hotelId', 'name location')
            .populate('assignedTo', 'username email firstName lastName')
            .sort({ createdAt: -1 });

        if (format === 'csv') {
            // Convert to CSV format
            const csvData = bookings.map(booking => ({
                'Booking ID': booking._id,
                'Guest Name': `${booking.guestInfo[0]?.firstName || ''} ${booking.guestInfo[0]?.lastName || ''}`,
                'Guest Email': booking.guestInfo[0]?.email || '',
                'Hotel': booking.hotelId?.name || '',
                'Location': booking.hotelId?.location || '',
                'Check-in': booking.startDate,
                'Check-out': booking.endDate,
                'Status': booking.status,
                'Total Amount': booking.totalAmount,
                'Created Date': booking.createdAt,
                'Assigned Admin': booking.assignedTo ? `${booking.assignedTo.firstName} ${booking.assignedTo.lastName}` : ''
            }));

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=bookings.csv');
            
            // Simple CSV conversion
            const csvString = csvData.map(row => 
                Object.values(row).map(value => `"${value}"`).join(',')
            ).join('\n');
            
            res.status(200).send(csvString);
        } else {
            // Return JSON format
            res.status(200).json({
                message: 'Bookings exported successfully',
                count: bookings.length,
                bookings
            });
        }
    } catch (error) {
        console.error('Export Bookings Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};






