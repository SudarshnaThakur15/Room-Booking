import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService.js';
import Roomcard from './Roomcard.jsx';
import SafeImage from './ui/SafeImage.jsx';

const HotelCard = React.memo(({ id, image, name, location, description, rating, pricerange, hotel }) => {
    const [showRooms, setShowRooms] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Memoize the handleTakeALook function to prevent recreation on every render
    const handleTakeALook = useCallback(async () => {
        
        const storedUserId = localStorage.getItem('userId');
        if (!storedUserId) {
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            // Add user activity
            await userService.addActivity({ 
                type: 'visited', 
                hotelId: id 
            });
            

            // Show rooms
            setShowRooms(true);
        } catch (error) {
            console.error('Error adding activity:', error);
            // Still show rooms even if activity tracking fails
            setShowRooms(true);
        } finally {
            setLoading(false);
        }
    }, [id, name]);

    // Memoize the closePopup function
    const closePopup = useCallback(() => {

        setShowRooms(false);
    }, [id, name]);

    // Memoize the star rating display to prevent recalculation
    const starRating = useMemo(() => {
        if (!rating) return null;
        
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        return (
            <div className="flex items-center">
                {[...Array(fullStars)].map((_, i) => (
                    <span key={i} className="text-yellow-500">★</span>
                ))}
                {hasHalfStar && (
                    <span className="text-yellow-500">☆</span>
                )}
            </div>
        );
    }, [rating]);

    // Memoize the hotel card content to prevent unnecessary re-renders
    const cardContent = useMemo(() => (
        <div className="hotel-card max-w-sm rounded-lg overflow-hidden shadow-lg border border-gray-300 hover:shadow-xl transition-optimized">
            <div className="image-container relative">
                <SafeImage
                    src={image}
                    alt={name}
                    fallbackType="hotel"
                    className="w-full h-80 object-cover"
                />
                {rating && (
                    <div className="absolute top-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded-full">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1 text-sm font-semibold">{rating}</span>
                    </div>
                )}
            </div>
            
            <div className="px-6 py-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{name}</h3>
                <p className="text-gray-600 text-sm mb-2">{location}</p>
                <p className="text-gray-700 text-sm mb-4 line-clamp-2">{description || 'No description available'}</p>
                
                <div className="flex items-center justify-between mb-4">
                    <span className="text-red-500 font-semibold">{pricerange}</span>
                    {starRating}
                </div>
                
                <button
                    onClick={handleTakeALook}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-optimized disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Loading...' : 'Take a Look'}
                </button>
            </div>
        </div>
    ), [image, name, location, description, rating, pricerange, starRating, handleTakeALook, loading]);

    // Handle escape key to close modal
    React.useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && showRooms) {
                closePopup();
            }
        };

        if (showRooms) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [showRooms, closePopup]);

    // Memoize the rooms modal to prevent re-rendering
    const roomsModal = useMemo(() => {
        if (!showRooms) return null;

        return (
            <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
                            <button
                                onClick={closePopup}
                                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                            >
                                ×
                            </button>
                        </div>
                        
                        <p className="text-gray-600 mb-6">{location}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {hotel.rooms?.map((room, index) => (
                                <Roomcard
                                    key={room._id || index}
                                    room={room}
                                    hotelName={name}
                                    hotelLocation={location}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }, [showRooms, name, location, hotel.rooms, closePopup]);

    return (
        <>
            {cardContent}
            {roomsModal}
        </>
    );
});

// Add display name for debugging
HotelCard.displayName = 'HotelCard';

// PropTypes for type checking
HotelCard.propTypes = {
    id: PropTypes.string.isRequired,
    image: PropTypes.string,
    name: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    description: PropTypes.string,
    rating: PropTypes.number,
    pricerange: PropTypes.string,
    hotel: PropTypes.object.isRequired
};

export default HotelCard;
