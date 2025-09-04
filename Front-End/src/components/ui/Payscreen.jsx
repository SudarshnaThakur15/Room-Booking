import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SafeImage from './SafeImage.jsx';

function PayScreen({ room, hotelName, hotelLocation, bookingData, onPaymentSuccess, onClose }) {
    const [isProcessing, setIsProcessing] = useState(false);

    const { name, pictures, price } = room;
    const { checkInDate, checkOutDate, nights, guests, guestDetails, totalPrice } = bookingData;

    const handlePayment = async () => {
        setIsProcessing(true);
        
        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            const bookingId = 'BK' + Date.now();
            
            onPaymentSuccess({
                bookingId,
                room,
                hotelName,
                hotelLocation,
                bookingData
            });
        } catch (error) {
            console.error('Payment failed:', error);
            alert('Payment failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Complete Your Booking</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                        >
                            ×
                        </button>
                    </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Booking Summary */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Summary</h3>
                    
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <div className="flex items-start gap-4">
                <SafeImage
                                src={pictures?.[0]}
                    alt={name}
                    fallbackType="room"
                                className="w-24 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-800">{name}</h4>
                                <p className="text-gray-600 text-sm">{hotelName}</p>
                                <p className="text-gray-600 text-sm">{hotelLocation}</p>
                                <p className="text-green-600 font-bold">${price}/night</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                        <h4 className="font-semibold text-gray-800 mb-2">Booking Details</h4>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Check-in:</span>
                                <span className="font-medium">{new Date(checkInDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Check-out:</span>
                                <span className="font-medium">{new Date(checkOutDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Duration:</span>
                                <span className="font-medium">{nights} night{nights !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Guests:</span>
                                <span className="font-medium">{guests}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Guest:</span>
                                <span className="font-medium">{guestDetails.firstName} {guestDetails.lastName}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-800 mb-2">Price Breakdown</h4>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Room Price:</span>
                                <span className="font-medium">${price} × {nights}</span>
                            </div>
                            <div className="flex justify-between border-t pt-2 mt-2">
                                <span className="text-gray-600">Total:</span>
                                <span className="font-bold text-lg text-green-600">${totalPrice}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Payment Form */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Information</h3>
                    
                    <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                        <p className="text-sm text-gray-700">
                            <strong>Demo Mode:</strong> This is a demonstration. No real payment will be processed.
                        </p>
                    </div>

                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Card Number
                            </label>
                            <input
                                type="text"
                                defaultValue="1234 5678 9012 3456"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="1234 5678 9012 3456"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Expiry Date
                                </label>
                                <input
                                    type="text"
                                    defaultValue="12/25"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="MM/YY"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    CVV
                                </label>
                                <input
                                    type="text"
                                    defaultValue="123"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="123"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cardholder Name
                            </label>
                            <input
                                type="text"
                                defaultValue={guestDetails.firstName + ' ' + guestDetails.lastName}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    {/* Pay Button */}
                    <button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Processing Payment...
                            </div>
                        ) : (
                            `Pay $${totalPrice}`
                        )}
                    </button>
                </div>
            </div>
                </div>
            </div>
        </div>
    );
}

PayScreen.propTypes = {
    room: PropTypes.shape({
        id: PropTypes.string,
        type: PropTypes.string,
        name: PropTypes.string,
        pictures: PropTypes.arrayOf(PropTypes.string),
        description: PropTypes.string,
        price: PropTypes.number.isRequired,
    }).isRequired,
        hotelName: PropTypes.string.isRequired,
    hotelLocation: PropTypes.string.isRequired,
    bookingData: PropTypes.shape({
        checkInDate: PropTypes.string.isRequired,
        checkOutDate: PropTypes.string.isRequired,
        nights: PropTypes.number.isRequired,
        guests: PropTypes.number.isRequired,
        guestDetails: PropTypes.shape({
            firstName: PropTypes.string.isRequired,
            lastName: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
            phone: PropTypes.string.isRequired,
            specialRequests: PropTypes.string
        }).isRequired,
        totalPrice: PropTypes.number.isRequired
    }).isRequired,
    onPaymentSuccess: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};

export default PayScreen;

