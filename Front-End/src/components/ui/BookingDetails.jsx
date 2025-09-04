import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SafeImage from './SafeImage.jsx';

const BookingDetails = ({ room, hotelName, hotelLocation, bookingDates, onProceedToPayment, onClose }) => {
    const [guestDetails, setGuestDetails] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        specialRequests: ''
    });
    const [errors, setErrors] = useState({});

    const totalPrice = bookingDates.nights * room.price;

    const validateGuestDetails = () => {
        const newErrors = {};

        if (!guestDetails.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!guestDetails.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!guestDetails.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(guestDetails.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!guestDetails.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field, value) => {
        setGuestDetails(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleProceedToPayment = () => {
        if (validateGuestDetails()) {
            onProceedToPayment({
                ...bookingDates,
                guestDetails,
                totalPrice
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Booking Details</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                        >
                            ×
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column - Room Details */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Room Information</h3>
                            
                            <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                <div className="flex items-start gap-4">
                                    <SafeImage
                                        src={room.pictures?.[0]}
                                        alt={room.name || room.type}
                                        fallbackType="room"
                                        className="w-24 h-20 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-800">{room.name || room.type}</h4>
                                        <p className="text-gray-600 text-sm">{hotelName}</p>
                                        <p className="text-gray-600 text-sm">{hotelLocation}</p>
                                        <p className="text-green-600 font-bold">${room.price}/night</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-800 mb-2">Booking Summary</h4>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Check-in:</span>
                                        <span className="font-medium">{new Date(bookingDates.checkInDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Check-out:</span>
                                        <span className="font-medium">{new Date(bookingDates.checkOutDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Duration:</span>
                                        <span className="font-medium">{bookingDates.nights} night{bookingDates.nights !== 1 ? 's' : ''}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Guests:</span>
                                        <span className="font-medium">{bookingDates.guests}</span>
                                    </div>
                                    <div className="flex justify-between border-t pt-2 mt-2">
                                        <span className="text-gray-600">Room Price:</span>
                                        <span className="font-medium">${room.price} × {bookingDates.nights}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total:</span>
                                        <span className="font-bold text-lg text-green-600">${totalPrice}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Guest Details Form */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Guest Information</h3>
                            
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={guestDetails.firstName}
                                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                errors.firstName ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter first name"
                                        />
                                        {errors.firstName && (
                                            <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Last Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={guestDetails.lastName}
                                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                errors.lastName ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter last name"
                                        />
                                        {errors.lastName && (
                                            <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        value={guestDetails.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            errors.email ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter email address"
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        value={guestDetails.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            errors.phone ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter phone number"
                                    />
                                    {errors.phone && (
                                        <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Special Requests (Optional)
                                    </label>
                                    <textarea
                                        value={guestDetails.specialRequests}
                                        onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Any special requests or notes..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6 pt-6 border-t">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleProceedToPayment}
                            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
                        >
                            Proceed to Payment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

BookingDetails.propTypes = {
    room: PropTypes.object.isRequired,
    hotelName: PropTypes.string.isRequired,
    hotelLocation: PropTypes.string.isRequired,
    bookingDates: PropTypes.shape({
        checkInDate: PropTypes.string.isRequired,
        checkOutDate: PropTypes.string.isRequired,
        guests: PropTypes.number.isRequired,
        nights: PropTypes.number.isRequired
    }).isRequired,
    onProceedToPayment: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};

export default BookingDetails;



