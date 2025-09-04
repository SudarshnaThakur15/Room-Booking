import express from 'express';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

// Import admin controllers
import * as adminHotelController from '../controllers/adminHotelController.js';

const router = express.Router();

// Apply admin authentication middleware to all routes
router.use(authenticateToken);
router.use(authorizeRole('admin'));

// ========================================
// HOTEL MANAGEMENT ROUTES
// ========================================

// Create a new hotel
router.post('/hotels', adminHotelController.createHotel);

// Get all hotels with admin details
router.get('/hotels', adminHotelController.getAllHotels);

// Get hotel by ID with admin details
router.get('/hotels/:hotelId', adminHotelController.getHotelById);

// Update hotel by ID
router.put('/hotels/:hotelId', adminHotelController.updateHotel);

// Delete hotel by ID
router.delete('/hotels/:hotelId', adminHotelController.deleteHotel);

// Toggle featured status
router.put('/hotels/:hotelId/featured', adminHotelController.toggleFeaturedStatus);

// Toggle verification status
router.put('/hotels/:hotelId/verify', adminHotelController.toggleVerificationStatus);

// Toggle active status
router.put('/hotels/:hotelId/status', adminHotelController.toggleHotelStatus);

// ========================================
// ANALYTICS & STATISTICS ROUTES
// ========================================

// Get hotel statistics
router.get('/stats', adminHotelController.getHotelStats);

export default router;