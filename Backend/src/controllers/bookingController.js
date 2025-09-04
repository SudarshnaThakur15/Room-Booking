import Booking from '../models/roomBooking.model.js';
import Hotel from '../models/hotel.model.js';
import User from '../models/user.model.js';

// Create new booking
export const createBooking = async (req, res) => {
    try {
        const { hotelId, roomId, startDate, endDate } = req.body;
        const userId = req.user.userId;

        // Validate dates
        if (new Date(startDate) >= new Date(endDate)) {
            return res.status(400).json({ message: 'End date must be after start date' });
        }

        // Check if room is available for the given dates
        const existingBooking = await Booking.findOne({
            roomId,
            status: 'completed',
            $or: [
                {
                    startDate: { $lte: new Date(endDate) },
                    endDate: { $gte: new Date(startDate) }
                }
            ]
        });

        if (existingBooking) {
            return res.status(400).json({ message: 'Room is not available for selected dates' });
        }

        // Create booking
        const newBooking = await Booking.create({
            userId,
            hotelId,
            roomId,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            status: 'draft'
        });

        // Add booking to user's bookings array
        await User.findByIdAndUpdate(userId, {
            $push: { bookings: newBooking._id }
        });

        res.status(201).json({
            message: 'Booking created successfully',
            booking: newBooking
        });
    } catch (error) {
        console.error('Create Booking Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user bookings
export const getUserBookings = async (req, res) => {
    try {
        const userId = req.user.userId;
        const bookings = await Booking.find({ userId })
            .populate('hotelId', 'name location images')
            .populate('roomId', 'type price amenities');

        res.status(200).json(bookings);
    } catch (error) {
        console.error('Get User Bookings Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get booking by ID
export const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const booking = await Booking.findOne({ _id: id, userId })
            .populate('hotelId', 'name location images')
            .populate('roomId', 'type price amenities');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json(booking);
    } catch (error) {
        console.error('Get Booking By ID Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const userId = req.user.userId;

        if (!['draft', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const updatedBooking = await Booking.findOneAndUpdate(
            { _id: id, userId },
            { status },
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json({
            message: 'Booking status updated successfully',
            booking: updatedBooking
        });
    } catch (error) {
        console.error('Update Booking Status Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const cancelledBooking = await Booking.findOneAndUpdate(
            { _id: id, userId, status: { $ne: 'cancelled' } },
            { status: 'cancelled' },
            { new: true }
        );

        if (!cancelledBooking) {
            return res.status(404).json({ message: 'Booking not found or already cancelled' });
        }

        res.status(200).json({
            message: 'Booking cancelled successfully',
            booking: cancelledBooking
        });
    } catch (error) {
        console.error('Cancel Booking Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all bookings (admin only)
export const getAllBookings = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const bookings = await Booking.find({})
            .populate('userId', 'username email')
            .populate('hotelId', 'name location')
            .populate('roomId', 'type price');

        res.status(200).json(bookings);
    } catch (error) {
        console.error('Get All Bookings Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}; 