import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AvailabilityChecker = ({ room, bookingDates, onAvailabilityConfirmed, onClose }) => {
    const [isChecking, setIsChecking] = useState(true);
    const [isAvailable, setIsAvailable] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        checkAvailability();
    }, []);

    const checkAvailability = async () => {
        try {
            setIsChecking(true);
            setError(null);

            // Simulate API call to check availability
            // In a real app, this would call your backend API
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Mock availability check logic
            // For demo purposes, we'll assume the room is available if it's marked as available
            const available = room.isAvailable && !room.maintenanceMode;

            setIsAvailable(available);
        } catch (err) {
            setError('Failed to check availability. Please try again.');
            console.error('Availability check error:', err);
        } finally {
            setIsChecking(false);
        }
    };

    const handleContinue = () => {
        if (isAvailable) {
            onAvailabilityConfirmed();
        }
    };

    const handleRetry = () => {
        checkAvailability();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Checking Availability</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>

                {isChecking && (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 text-lg">Checking room availability...</p>
                        <p className="text-gray-500 text-sm mt-2">
                            Please wait while we verify your selected dates
                        </p>
                    </div>
                )}

                {!isChecking && error && (
                    <div className="text-center py-8">
                        <div className="text-red-500 text-6xl mb-4">⚠️</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Error</h3>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button
                            onClick={handleRetry}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {!isChecking && !error && !isAvailable && (
                    <div className="text-center py-8">
                        <div className="text-red-500 text-6xl mb-4">❌</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Room Not Available</h3>
                        <p className="text-gray-600 mb-4">
                            Sorry, this room is not available for the selected dates.
                        </p>
                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                            <p className="text-sm text-gray-600">
                                <strong>Selected Dates:</strong><br />
                                Check-in: {new Date(bookingDates.checkInDate).toLocaleDateString()}<br />
                                Check-out: {new Date(bookingDates.checkOutDate).toLocaleDateString()}<br />
                                Duration: {bookingDates.nights} night{bookingDates.nights !== 1 ? 's' : ''}
                            </p>
                        </div>
                        <p className="text-gray-500 text-sm mb-6">
                            Please try different dates or select another room.
                        </p>
                        <button
                            onClick={onClose}
                            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                        >
                            Select Different Dates
                        </button>
                    </div>
                )}

                {!isChecking && !error && isAvailable && (
                    <div className="text-center py-8">
                        <div className="text-green-500 text-6xl mb-4">✅</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Room Available!</h3>
                        <p className="text-gray-600 mb-4">
                            Great news! This room is available for your selected dates.
                        </p>
                        <div className="bg-green-50 p-4 rounded-lg mb-6">
                            <p className="text-sm text-gray-700">
                                <strong>Room:</strong> {room.name || room.type}<br />
                                <strong>Check-in:</strong> {new Date(bookingDates.checkInDate).toLocaleDateString()}<br />
                                <strong>Check-out:</strong> {new Date(bookingDates.checkOutDate).toLocaleDateString()}<br />
                                <strong>Duration:</strong> {bookingDates.nights} night{bookingDates.nights !== 1 ? 's' : ''}<br />
                                <strong>Guests:</strong> {bookingDates.guests}
                            </p>
                        </div>
                        <p className="text-gray-500 text-sm mb-6">
                            You can now proceed to complete your booking.
                        </p>
                        <button
                            onClick={handleContinue}
                            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold"
                        >
                            Continue to Booking
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

AvailabilityChecker.propTypes = {
    room: PropTypes.object.isRequired,
    bookingDates: PropTypes.shape({
        checkInDate: PropTypes.string.isRequired,
        checkOutDate: PropTypes.string.isRequired,
        guests: PropTypes.number.isRequired,
        nights: PropTypes.number.isRequired
    }).isRequired,
    onAvailabilityConfirmed: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};

export default AvailabilityChecker;



