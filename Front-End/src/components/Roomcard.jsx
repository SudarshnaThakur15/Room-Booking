import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService.js';
import DatePicker from './ui/Datepicker.jsx';
import AvailabilityChecker from './ui/AvailabilityChecker.jsx';
import BookingDetails from './ui/BookingDetails.jsx';
import Payscreen from './ui/Payscreen.jsx';
import PaymentSuccess from './ui/PaymentSuccess.jsx';
import SafeImage from './ui/SafeImage.jsx';

const RoomCard = React.memo(({ room, hotelName, hotelLocation }) => {
    const [bookingStep, setBookingStep] = useState(null); // null, 'datePicker', 'availability', 'details', 'payment', 'success'
    const [bookingData, setBookingData] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Memoize room data to prevent unnecessary re-renders
    const roomData = useMemo(() => ({
        id: room._id,
        type: room.type,
        name: room.name,
        pictures: room.pictures || [],
        description: room.description,
        isAvailable: room.isAvailable,
        price: room.price,
        amenities: room.amenities || []
    }), [room]);

    const handleBookNow = useCallback(async () => {
        const storedUserId = localStorage.getItem('userId');
        if (!storedUserId) {
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            await userService.addActivity({ 
                type: 'viewed_room', 
                hotelId: roomData.id 
            });
            setBookingStep('datePicker');
        } catch (error) {
            setBookingStep('datePicker');
        } finally {
            setLoading(false);
        }
    }, [roomData]);

    const handleDateSelect = useCallback((dates) => {
        setBookingData(dates);
        setBookingStep('availability');
    }, []);

    const handleAvailabilityConfirmed = useCallback(() => {
        setBookingStep('details');
    }, []);

    const handleProceedToPayment = useCallback((details) => {
        setBookingData(prev => ({ ...prev, ...details }));
        setBookingStep('payment');
    }, []);

    const handlePaymentSuccess = useCallback((paymentData) => {
        setBookingData(paymentData);
        setBookingStep('success');
    }, []);

    const closeBookingFlow = useCallback(() => {
        setBookingStep(null);
        setBookingData(null);
    }, [roomData.id]);

    // Memoize the room card content
    const cardContent = useMemo(() => (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-200">
            {/* Room Image */}
            <div className="relative h-48">
                <SafeImage
                    src={roomData.pictures[0]}
                    alt={roomData.name || roomData.type}
                    fallbackType="room"
                    className="w-full h-full object-cover"
                />
                {!roomData.isAvailable && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white text-lg font-semibold">Not Available</span>
                    </div>
                )}
            </div>

            {/* Room Details */}
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                        {roomData.name || roomData.type}
                    </h3>
                    <span className="text-green-600 font-bold text-lg">
                        ${roomData.price}
                    </span>
                </div>

                {roomData.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {roomData.description}
                    </p>
                )}

                {/* Amenities */}
                {roomData.amenities && roomData.amenities.length > 0 && (
                    <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">Amenities:</p>
                        <div className="flex flex-wrap gap-1">
                            {roomData.amenities.slice(0, 3).map((amenity, index) => (
                                <span
                                    key={index}
                                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                                >
                                    {amenity}
                                </span>
                            ))}
                            {roomData.amenities.length > 3 && (
                                <span className="text-xs text-gray-500">
                                    +{roomData.amenities.length - 3} more
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Book Now Button */}
                <button
                    onClick={handleBookNow}
                    disabled={!roomData.isAvailable || loading}
                    className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors duration-200 ${
                        roomData.isAvailable
                            ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
                            : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    }`}
                >
                    {loading ? 'Loading...' : roomData.isAvailable ? 'Book Now' : 'Not Available'}
                </button>
            </div>
        </div>
    ), [roomData, handleBookNow, loading]);

    // Memoize the booking modal
    const bookingModal = useMemo(() => {
        if (!bookingStep) return null;

        const renderStep = () => {
            switch (bookingStep) {
                case 'datePicker':
                    return (
                        <DatePicker
                            onDateSelect={handleDateSelect}
                            onClose={closeBookingFlow}
                        />
                    );
                case 'availability':
                    return (
                        <AvailabilityChecker
                            room={roomData}
                            bookingDates={bookingData}
                            onAvailabilityConfirmed={handleAvailabilityConfirmed}
                            onClose={closeBookingFlow}
                        />
                    );
                case 'details':
                    return (
                        <BookingDetails
                            room={roomData}
                            hotelName={hotelName}
                            hotelLocation={hotelLocation}
                            bookingDates={bookingData}
                            onProceedToPayment={handleProceedToPayment}
                            onClose={closeBookingFlow}
                        />
                    );
                case 'payment':
                    return (
                        <Payscreen
                            room={roomData}
                            hotelName={hotelName}
                            hotelLocation={hotelLocation}
                            bookingData={bookingData}
                            onPaymentSuccess={handlePaymentSuccess}
                            onClose={closeBookingFlow}
                        />
                    );
                case 'success':
                    return (
                        <PaymentSuccess
                            bookingData={bookingData}
                            onClose={closeBookingFlow}
                        />
                    );
                default:
                    return null;
            }
        };

        return renderStep();
    }, [bookingStep, bookingData, roomData, hotelName, hotelLocation, handleDateSelect, handleAvailabilityConfirmed, handleProceedToPayment, handlePaymentSuccess, closeBookingFlow]);

    return (
        <>
            {cardContent}
            {bookingModal}
        </>
    );
});

// Add display name for debugging
RoomCard.displayName = 'RoomCard';

// PropTypes for type checking
RoomCard.propTypes = {
    room: PropTypes.shape({
        _id: PropTypes.string,
        type: PropTypes.string,
        name: PropTypes.string,
        pictures: PropTypes.arrayOf(PropTypes.string),
        description: PropTypes.string,
        isAvailable: PropTypes.bool,
        price: PropTypes.number,
        amenities: PropTypes.arrayOf(PropTypes.string)
    }).isRequired,
    hotelName: PropTypes.string.isRequired,
    hotelLocation: PropTypes.string.isRequired
};

export default RoomCard;
