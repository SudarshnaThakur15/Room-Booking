import React from 'react';
import PropTypes from 'prop-types';

const PaymentSuccess = ({ bookingData, onClose }) => {
    const { bookingId, room, hotelName, hotelLocation, bookingData: booking } = bookingData;
    const { checkInDate, checkOutDate, nights, guests, guestDetails, totalPrice } = booking;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
                <div className="text-center">
                    <div className="text-green-500 text-6xl mb-4">✅</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
                    <p className="text-gray-600 mb-6">
                        Your booking has been confirmed. You will receive a confirmation email shortly.
                    </p>

                    <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                        <h3 className="font-semibold text-gray-800 mb-2">Booking Details</h3>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Booking ID:</span>
                                <span className="font-medium">{bookingId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Room:</span>
                                <span className="font-medium">{room.name || room.type}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Hotel:</span>
                                <span className="font-medium">{hotelName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Location:</span>
                                <span className="font-medium">{hotelLocation}</span>
                            </div>
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
                            <div className="flex justify-between border-t pt-2 mt-2">
                                <span className="text-gray-600">Total Paid:</span>
                                <span className="font-bold text-green-600">${totalPrice}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg mb-6">
                        <h4 className="font-semibold text-gray-800 mb-2">What's Next?</h4>
                        <ul className="text-sm text-gray-600 text-left space-y-1">
                            <li>• You'll receive a confirmation email at {guestDetails.email}</li>
                            <li>• Check-in is available from 3:00 PM on {new Date(checkInDate).toLocaleDateString()}</li>
                            <li>• Check-out is by 11:00 AM on {new Date(checkOutDate).toLocaleDateString()}</li>
                            <li>• Contact the hotel directly for any special requests</li>
                        </ul>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

PaymentSuccess.propTypes = {
    bookingData: PropTypes.shape({
        bookingId: PropTypes.string.isRequired,
        room: PropTypes.object.isRequired,
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
        }).isRequired
    }).isRequired,
    onClose: PropTypes.func.isRequired
};

export default PaymentSuccess;



