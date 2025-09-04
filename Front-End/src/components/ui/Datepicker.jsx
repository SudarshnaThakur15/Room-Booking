import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const DatePicker = ({ onDateSelect, onClose }) => {
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [guests, setGuests] = useState(1);
    const [errors, setErrors] = useState({});

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Validate dates
    const validateDates = () => {
        const newErrors = {};

        if (!checkInDate) {
            newErrors.checkIn = 'Please select a check-in date';
        } else if (new Date(checkInDate) < new Date(today)) {
            newErrors.checkIn = 'Check-in date cannot be in the past';
        }

        if (!checkOutDate) {
            newErrors.checkOut = 'Please select a check-out date';
        } else if (checkOutDate <= checkInDate) {
            newErrors.checkOut = 'Check-out date must be after check-in date';
        }

        if (guests < 1 || guests > 10) {
            newErrors.guests = 'Number of guests must be between 1 and 10';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Calculate number of nights
    const calculateNights = () => {
        if (checkInDate && checkOutDate) {
            const checkIn = new Date(checkInDate);
            const checkOut = new Date(checkOutDate);
            const diffTime = Math.abs(checkOut - checkIn);
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }
        return 0;
    };

    const handleContinue = () => {
        if (validateDates()) {
            const nights = calculateNights();
            onDateSelect({
                checkInDate,
                checkOutDate,
                guests,
                nights
            });
        }
    };

    const handleClose = () => {
        setCheckInDate('');
        setCheckOutDate('');
        setGuests(1);
        setErrors({});
        onClose();
    };

  return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Select Dates</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Check-in Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Check-in Date
                        </label>
                        <input
                            type="date"
                            value={checkInDate}
                            onChange={(e) => setCheckInDate(e.target.value)}
                            min={today}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                errors.checkIn ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.checkIn && (
                            <p className="text-red-500 text-sm mt-1">{errors.checkIn}</p>
                        )}
                    </div>

                    {/* Check-out Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Check-out Date
                        </label>
                        <input
                            type="date"
                            value={checkOutDate}
                            onChange={(e) => setCheckOutDate(e.target.value)}
                            min={checkInDate || today}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                errors.checkOut ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.checkOut && (
                            <p className="text-red-500 text-sm mt-1">{errors.checkOut}</p>
                        )}
                    </div>

                    {/* Number of Guests */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Number of Guests
                        </label>
                        <select
                            value={guests}
                            onChange={(e) => setGuests(parseInt(e.target.value))}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                errors.guests ? 'border-red-500' : 'border-gray-300'
                            }`}
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                <option key={num} value={num}>
                                    {num} {num === 1 ? 'Guest' : 'Guests'}
                                </option>
                            ))}
                        </select>
                        {errors.guests && (
                            <p className="text-red-500 text-sm mt-1">{errors.guests}</p>
                        )}
                    </div>

                    {/* Summary */}
                    {checkInDate && checkOutDate && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-800 mb-2">Booking Summary</h3>
                            <p className="text-sm text-gray-600">
                                <strong>Check-in:</strong> {new Date(checkInDate).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>Check-out:</strong> {new Date(checkOutDate).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>Duration:</strong> {calculateNights()} night{calculateNights() !== 1 ? 's' : ''}
                            </p>
                            <p className="text-sm text-gray-600">
                                <strong>Guests:</strong> {guests}
                            </p>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={handleClose}
                        className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleContinue}
                        disabled={!checkInDate || !checkOutDate}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Check Availability
                    </button>
                </div>
            </div>
        </div>
    );
};

DatePicker.propTypes = {
    onDateSelect: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};

export default DatePicker;