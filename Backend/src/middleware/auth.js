import jwt from 'jsonwebtoken';

// Authentication middleware
export const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ message: 'Access token required' });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid or expired token' });
            }
            req.user = user;
            next();
        });
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Role-based authorization middleware
export const authorizeRole = (roles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Authentication required' });
            }

            if (!roles.includes(req.user.role)) {
                return res.status(403).json({ 
                    message: 'Access denied. Insufficient permissions.' 
                });
            }

            next();
        } catch (error) {
            console.error('Role Authorization Error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    };
};

// Admin only middleware
export const adminOnly = authorizeRole(['admin']);

// Customer only middleware
export const customerOnly = authorizeRole(['customer', 'admin']); 