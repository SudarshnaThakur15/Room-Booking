import { body, validationResult } from 'express-validator';

// Validation middleware
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            message: 'Validation failed', 
            errors: errors.array() 
        });
    }
    next();
};

// User signup validation
export const validateSignup = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    validate
];

// User login validation
export const validateLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    validate
];

// Hotel creation validation
export const validateHotel = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 255 })
        .withMessage('Hotel name must be between 2 and 255 characters'),
    body('location')
        .trim()
        .isLength({ min: 2, max: 255 })
        .withMessage('Location must be between 2 and 255 characters'),
    body('rating')
        .optional()
        .isFloat({ min: 0, max: 5 })
        .withMessage('Rating must be between 0 and 5'),
    validate
];

// Booking validation
export const validateBooking = [
    body('hotelId')
        .isMongoId()
        .withMessage('Invalid hotel ID'),
    body('roomId')
        .isMongoId()
        .withMessage('Invalid room ID'),
    body('startDate')
        .isISO8601()
        .withMessage('Start date must be a valid date'),
    body('endDate')
        .isISO8601()
        .withMessage('End date must be a valid date'),
    validate
]; 