import { Schema, model } from 'mongoose';

const ActivitySchema = new Schema({
  type: { 
    type: String,
    enum: ['viewed_hotel', 'viewed_room', 'searched', 'draft_booking', 'completed_booking', 'cancelled_booking', 'rated_hotel', 'rated_room', 'visited', 'favorited_hotel'],
    required: true
  },
  hotelId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Hotel' 
  },
  roomId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Room' 
  },
  searchQuery: String,
  rating: Number,
  duration: Number, // Time spent on page in seconds
  sessionId: String, // To track user sessions
  metadata: Schema.Types.Mixed, // Additional data like filters, price ranges, etc.
  date: { 
    type: Date,
    default: Date.now 
  }
});

const UserSchema = new Schema({
  username: { 
    type: String,
    required: true, 
    unique: true 
  },
  email: { 
    type: String, 
    required: true,
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['customer', 'admin'], 
    default: 'customer' 
  },
  
  // Enhanced admin permissions
  adminPermissions: {
    canManageHotels: { type: Boolean, default: false },
    canManageBookings: { type: Boolean, default: false },
    canViewAnalytics: { type: Boolean, default: false },
    canManageUsers: { type: Boolean, default: false },
    canViewReports: { type: Boolean, default: false }
  },
  
  // User preferences for recommendations
  preferences: {
    favoriteHotels: [{ type: Schema.Types.ObjectId, ref: 'Hotel' }],
    favoriteRoomTypes: [String],
    priceRange: { 
      min: { type: Number, default: 0 },
      max: { type: Number, default: 10000 }
    },
    preferredLocations: [String],
    preferredAmenities: [String],
    travelStyle: { type: String, enum: ['budget', 'mid-range', 'luxury', 'business'] },
    preferredRating: { type: Number, min: 0, max: 5 }
  },
  
  // Enhanced activity tracking
  activities: [ActivitySchema],
  
  // Enhanced booking history
  bookings: [{ type: Schema.Types.ObjectId, ref: 'Booking' }],
  
  // User analytics
  totalBookings: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now },
  
  // Profile information
  firstName: String,
  lastName: String,
  phone: String,
  address: String,
  dateOfBirth: Date,
  
  // Account status
  isActive: { type: Boolean, default: true },
  emailVerified: { type: Boolean, default: false },
  lastLogin: { type: Date, default: Date.now },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update timestamps on save
UserSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Set admin permissions based on role
UserSchema.pre('save', function(next) {
  if (this.role === 'admin') {
    this.adminPermissions = {
      canManageHotels: true,
      canManageBookings: true,
      canViewAnalytics: true,
      canManageUsers: true,
      canViewReports: true
    };
  }
  next();
});

const Activity = model('Activity', ActivitySchema);
const User = model('User', UserSchema);

export default User;



