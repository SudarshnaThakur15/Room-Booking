import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// User signup
export const signup = async (req, res) => {
    try {
        const { username, email, password, firstName, lastName, phone, address, dateOfBirth } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });
        
        if (existingUser) {
            return res.status(400).json({ 
                message: existingUser.email === email ? 'Email already registered' : 'Username already taken' 
            });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user with enhanced fields
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            firstName,
            lastName,
            phone,
            address,
            dateOfBirth,
            role: 'customer', // Default role
            preferences: {
                priceRange: { min: 0, max: 10000 },
                travelStyle: 'mid-range'
            }
        });

        await newUser.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
                firstName: newUser.firstName,
                lastName: newUser.lastName
            }
        });
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// User login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(403).json({ message: 'Account is deactivated' });
        }

        // Check if password matches
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Update last login
        user.lastLogin = new Date();
        user.lastActive = new Date();
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        res.status(200).json({ 
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                adminPermissions: user.adminPermissions
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user profile
export const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId)
            .select('-password')
            .populate('preferences.favoriteHotels', 'name location images rating');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(200).json(user);
    } catch (error) {
        console.error('Get Profile Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user profile
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { firstName, lastName, phone, address, dateOfBirth, preferences } = req.body;

        const updateData = {};
        if (firstName) updateData.firstName = firstName;
        if (lastName) updateData.lastName = lastName;
        if (phone) updateData.phone = phone;
        if (address) updateData.address = address;
        if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
        if (preferences) updateData.preferences = preferences;

        const user = await User.findByIdAndUpdate(
            userId,
            { ...updateData, updatedAt: new Date() },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'Profile updated successfully',
            user
        });
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Add user activity
export const addActivity = async (req, res) => {
    try {
        const { type, hotelId, roomId, searchQuery, duration, sessionId, metadata } = req.body;
        const userId = req.user.userId;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Add activity with enhanced fields
        user.activities.push({ 
            type, 
            hotelId, 
            roomId, 
            searchQuery, 
            duration, 
            sessionId, 
            metadata,
            date: new Date()
        });

        // Update last active
        user.lastActive = new Date();
        await user.save();

        res.status(200).json({ message: 'Activity added successfully' });
    } catch (error) {
        console.error('Add Activity Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user activities
export const getActivities = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { limit = 50, type, hotelId } = req.query;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        let activities = user.activities;
        
        // Apply filters
        if (type) {
            activities = activities.filter(activity => activity.type === type);
        }
        if (hotelId) {
            activities = activities.filter(activity => activity.hotelId?.toString() === hotelId);
        }
        
        // Sort by date and limit
        activities = activities
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, parseInt(limit));
        
        res.status(200).json(activities);
    } catch (error) {
        console.error('Get Activities Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Toggle favorite hotel
export const toggleFavoriteHotel = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { hotelId } = req.body;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const favoriteIndex = user.preferences.favoriteHotels.indexOf(hotelId);
        
        if (favoriteIndex > -1) {
            // Remove from favorites
            user.preferences.favoriteHotels.splice(favoriteIndex, 1);
            await user.save();
            res.status(200).json({ message: 'Hotel removed from favorites' });
        } else {
            // Add to favorites
            user.preferences.favoriteHotels.push(hotelId);
            await user.save();
            res.status(200).json({ message: 'Hotel added to favorites' });
        }
    } catch (error) {
        console.error('Toggle Favorite Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user preferences
export const getPreferences = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId).select('preferences');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(200).json(user.preferences);
    } catch (error) {
        console.error('Get Preferences Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user preferences
export const updatePreferences = async (req, res) => {
    try {
        const userId = req.user.userId;
        const preferences = req.body;
        
        const user = await User.findByIdAndUpdate(
            userId,
            { preferences, updatedAt: new Date() },
            { new: true, runValidators: true }
        ).select('preferences');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(200).json({
            message: 'Preferences updated successfully',
            preferences: user.preferences
        });
    } catch (error) {
        console.error('Update Preferences Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Admin: Get all users (admin only)
export const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 20, role, search } = req.query;
        const skip = (page - 1) * limit;
        
        let query = {};
        
        if (role) {
            query.role = role;
        }
        
        if (search) {
            query.$or = [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } }
            ];
        }
        
        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
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

// Admin: Update user role (admin only)
export const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role, adminPermissions } = req.body;
        
        const user = await User.findByIdAndUpdate(
            userId,
            { 
                role, 
                adminPermissions,
                updatedAt: new Date() 
            },
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(200).json({
            message: 'User role updated successfully',
            user
        });
    } catch (error) {
        console.error('Update User Role Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}; 