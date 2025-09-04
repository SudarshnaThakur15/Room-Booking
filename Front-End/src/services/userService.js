import api from './api.js';

export const userService = {
    // User signup
    signup: async (userData) => {
        const response = await api.post('/api/users/signup', userData);
        return response.data;
    },

    // User login
    login: async (credentials) => {
        const response = await api.post('/api/users/login', credentials);
        return response.data;
    },

    // Get user profile
    getProfile: async () => {
        const response = await api.get('/api/users/profile');
        return response.data;
    },

    // Add user activity
    addActivity: async (activityData) => {
        const response = await api.put('/api/users/activities', activityData);
        return response.data;
    },

    // Get user activities
    getActivities: async () => {
        const response = await api.get('/api/users/activities');
        return response.data;
    },

    // Update user profile
    updateProfile: async (profileData) => {
        const response = await api.put('/api/users/profile', profileData);
        return response.data;
    },

    // Get user bookings
    getBookings: async () => {
        const response = await api.get('/api/users/bookings');
        return response.data;
    },

    // Logout (client-side)
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }
}; 