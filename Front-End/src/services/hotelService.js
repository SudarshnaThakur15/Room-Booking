import api from './api.js';

export const hotelService = {
    // Get all hotels with pagination and sorting
    getAllHotels: async (params = {}) => {
        const response = await api.get('/api/hotels/allhotels', { params });
        return response.data;
    },

    // Get hotel by ID
    getHotelById: async (id) => {
        const response = await api.get(`/api/hotels/${id}`);
        return response.data;
    },

    // Basic search hotels
    searchHotels: async (params) => {
        const response = await api.get('/api/hotels/search', { params });
        return response.data;
    },

    // Advanced search with multiple filters
    advancedSearch: async (params) => {
        const response = await api.get('/api/hotels/search/advanced', { params });
        return response.data;
    },

    // Get featured hotels
    getFeaturedHotels: async (limit = 10) => {
        const response = await api.get('/api/hotels/featured', { params: { limit } });
        return response.data;
    },

    // Get hotels by location
    getHotelsByLocation: async (location, params = {}) => {
        const response = await api.get(`/api/hotels/location/${encodeURIComponent(location)}`, { params });
        return response.data;
    },

    // Get hotels by price range
    getHotelsByPriceRange: async (range, params = {}) => {
        const response = await api.get(`/api/hotels/price/${encodeURIComponent(range)}`, { params });
        return response.data;
    },

    // Get hotels by amenities
    getHotelsByAmenity: async (amenity, params = {}) => {
        const response = await api.get(`/api/hotels/amenities/${encodeURIComponent(amenity)}`, { params });
        return response.data;
    },

    // Create hotel (admin only)
    createHotel: async (hotelData) => {
        const response = await api.post('/api/hotels', hotelData);
        return response.data;
    },

    // Update hotel (admin only)
    updateHotel: async (id, hotelData) => {
        const response = await api.put(`/api/hotels/${id}`, hotelData);
        return response.data;
    },

    // Delete hotel (admin only)
    deleteHotel: async (id) => {
        const response = await api.delete(`/api/hotels/${id}`);
        return response.data;
    }
}; 