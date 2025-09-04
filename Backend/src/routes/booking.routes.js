import express from 'express';
import { 
    createBooking, 
    getUserBookings, 
    getBookingById, 
    updateBookingStatus, 
    cancelBooking, 
    getAllBookings 
} from '../controllers/bookingController.js';
import { 
    authenticateToken, 
    customerOnly, 
    adminOnly 
} from '../middleware/auth.js';
import { validateBooking } from '../middleware/validation.js';

const router = express.Router();

// Create a new booking
router.post('/', authenticateToken, customerOnly, validateBooking, createBooking);

// Get user's bookings
router.get('/user', authenticateToken, customerOnly, getUserBookings);

// Get specific booking by ID
router.get('/user/:id', authenticateToken, customerOnly, getBookingById);

// Update booking status (Admin only)
router.put('/:id/status', authenticateToken, adminOnly, updateBookingStatus);

// Cancel booking
router.put('/:id/cancel', authenticateToken, customerOnly, cancelBooking);

// Get all bookings (Admin only)
router.get('/all', authenticateToken, adminOnly, getAllBookings);

export default router;