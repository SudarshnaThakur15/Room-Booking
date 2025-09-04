import express from 'express';
import { 
    signup, 
    login, 
    getProfile, 
    updateProfile,
    addActivity, 
    getActivities 
} from '../controllers/userController.js';
import { 
    getUserBookings 
} from '../controllers/bookingController.js';
import { 
    authenticateToken, 
    customerOnly 
} from '../middleware/auth.js';
import { 
    validateSignup, 
    validateLogin 
} from '../middleware/validation.js';

const router = express.Router();

// User registration
router.post('/signup', validateSignup, signup);

// User login
router.post('/login', validateLogin, login);

// Get user profile
router.get('/profile', authenticateToken, getProfile);

// Update user profile
router.put('/profile', authenticateToken, updateProfile);

// Get user bookings
router.get('/bookings', authenticateToken, getUserBookings);

// Update user activities
router.put('/activities', authenticateToken, customerOnly, addActivity);

// Get user activities
router.get('/activities', authenticateToken, customerOnly, getActivities);

export default router;