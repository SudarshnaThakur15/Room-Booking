import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../services/userService.js';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                try {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                } catch (error) {
                    console.error('Error parsing stored user:', error);
                    userService.logout();
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await userService.login(credentials);
            const { token: newToken, user: userData } = response;

            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('userId', userData.id);

            setToken(newToken);
            setUser(userData);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const signup = async (userData) => {
        try {
            const response = await userService.signup(userData);
            return { success: true, message: response.message };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        userService.logout();
        setUser(null);
        setToken(null);
    };

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const isAuthenticated = !!token && !!user;
    const isAdmin = user?.role === 'admin';

    const value = {
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        signup,
        logout,
        updateUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 