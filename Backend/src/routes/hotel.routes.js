import { Router } from 'express';
import * as hotelController from '../controllers/hotelController.js';

const router = Router();

// Get all hotels with pagination
router.get('/allhotels', hotelController.getAllHotels);

// Search hotels
router.get('/search', hotelController.searchHotels);

// Advanced search
router.post('/search/advanced', hotelController.advancedSearch);

// Get featured hotels
router.get('/featured', hotelController.getFeaturedHotels);

// Get hotels by location
router.get('/location/:location', hotelController.getHotelsByLocation);

// Get hotels by price range
router.get('/price/:range', hotelController.getHotelsByPriceRange);

// Get hotels by amenity
router.get('/amenities/:amenity', hotelController.getHotelsByAmenity);

// Get hotel by ID
router.get('/:id', hotelController.getHotelById);

export default router;