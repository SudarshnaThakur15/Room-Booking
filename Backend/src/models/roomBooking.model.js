import mongoose from 'mongoose';

const GuestInfoSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: String,
  phone: String,
  specialRequests: String,
  dietaryRestrictions: [String]
});

const PaymentInfoSchema = new mongoose.Schema({
  method: { 
    type: String, 
    enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash'],
    required: true
  },
  transactionId: String,
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paidAt: Date,
  refundedAt: Date
});

const CancellationInfoSchema = new mongoose.Schema({
  cancelledAt: Date,
  cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reason: String,
  refundAmount: Number,
  refundStatus: { 
    type: String, 
    enum: ['pending', 'completed', 'denied'],
    default: 'pending'
  }
});

const BookingSchema = new mongoose.Schema({
  // Basic booking info
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  hotelId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hotel',
    required: true
  },
  roomId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Room',
    required: true
  },
  
  // Enhanced booking dates
  startDate: { 
    type: Date, 
    required: true 
  },
  endDate: { 
    type: Date, 
    required: true 
  },
  checkInTime: String,
  checkOutTime: String,
  
  // Enhanced booking status
  status: { 
    type: String, 
    enum: ['draft', 'pending', 'confirmed', 'checked_in', 'checked_out', 'completed', 'cancelled', 'no_show'],
    default: 'draft' 
  },
  
  // Guest information
  guestCount: { type: Number, default: 1 },
  guestInfo: [GuestInfoSchema],
  
  // Pricing and payment
  basePrice: { type: Number, required: true },
  taxes: { type: Number, default: 0 },
  fees: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  
  // Payment information
  payment: PaymentInfoSchema,
  
  // Cancellation information
  cancellation: CancellationInfoSchema,
  
  // Booking metadata
  source: { 
    type: String, 
    enum: ['website', 'mobile_app', 'phone', 'walk_in'],
    default: 'website'
  },
  specialRequests: String,
  notes: String,
  
  // Admin management
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Admin assigned to this booking
  priority: { 
    type: String, 
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  confirmedAt: Date,
  checkedInAt: Date,
  checkedOutAt: Date
});

// Update timestamps on save
BookingSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Calculate total amount before saving
BookingSchema.pre('save', function(next) {
  if (this.basePrice) {
    this.totalAmount = this.basePrice + this.taxes + this.fees - this.discount;
  }
  next();
});

// Update hotel and room metrics when booking status changes
BookingSchema.post('save', async function(doc) {
  try {
    const Hotel = mongoose.model('Hotel');
    const Room = mongoose.model('Room');
    
    // Update hotel metrics
    await Hotel.findByIdAndUpdate(doc.hotelId, {
      $inc: { totalBookings: 1 },
      $set: { updatedAt: new Date() }
    });
    
    // Update room metrics
    await Hotel.updateOne(
      { _id: doc.hotelId, 'rooms._id': doc.roomId },
      { 
        $inc: { 'rooms.$.totalBookings': 1 },
        $set: { 'rooms.$.updatedAt': new Date() }
      }
    );
  } catch (error) {
    console.error('Error updating hotel/room metrics:', error);
  }
});

const Booking = mongoose.model('Booking', BookingSchema);

export default Booking;