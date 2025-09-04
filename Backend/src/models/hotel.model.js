import { Schema, model } from "mongoose";
import mongoose from 'mongoose';

const RoomSchema = new Schema({
  _id: { 
    type: mongoose.Schema.Types.ObjectId, 
    auto: true 
  },
  type: { 
    type: String,
    enum: ['deluxe', 'semi-deluxe', 'non-deluxe', 'suite', 'presidential', 'standard'],
    required: true
  },
  name: String,
  roomNumber: String,
  floor: Number,
  capacity: Number,
  bedType: String,
  price: { 
    type: Number,
    required: true
  },
  basePrice: Number,
  seasonalPricing: [{
    season: String,
    price: Number,
    startDate: Date,
    endDate: Date
  }],
  pictures: {
    type: [String],
    default: []
  },
  isAvailable: { 
    type: Boolean, 
    default: true 
  },
  maintenanceMode: { 
    type: Boolean, 
    default: false 
  },
  amenities: [String],
  description: String,
  
  // Room metrics
  totalBookings: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update room timestamps
RoomSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const hotelSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 255
  },
  location: {
    type: String,
    required: true,
    maxlength: 255
  },
  description: String,
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  
  // Enhanced amenities (changed from String to Array)
  amenities: [String],
  
  // Enhanced pricing
  price_range: {
    type: String,
    maxlength: 50
  },
  basePrice: Number,
  seasonalPricing: [{
    season: String,
    price: Number,
    startDate: Date,
    endDate: Date
  }],
  
  // Enhanced images
  images: {
    type: [String],
    default: []
  },
  
  // Enhanced contact information
  contact: {
    phone: [Number],
    email: String,
    address: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
    website: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  
  // Business information
  businessHours: {
    checkIn: String,
    checkOut: String,
    frontDesk: String
  },
  
  // Hotel management
  isActive: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  verified: { type: Boolean, default: false },
  category: { 
    type: String,
    enum: ['Luxury Hotels', 'Business Hotels', 'Resort Hotels', 'Boutique Hotels'],
    default: 'Luxury Hotels'
  },
  
  // Business metrics
  totalBookings: { type: Number, default: 0 },
  totalRevenue: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  occupancyRate: { type: Number, default: 0 },
  
  // Admin management
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  lastUpdatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  
  // Rooms
  rooms: [RoomSchema],
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update hotel timestamps
hotelSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Update room timestamps when hotel is updated
hotelSchema.pre('save', function(next) {
  if (this.rooms && this.rooms.length > 0) {
    this.rooms.forEach(room => {
      room.updatedAt = new Date();
    });
  }
  next();
});

const Hotel = model('Hotel', hotelSchema);
const Room = model('Room', RoomSchema);

export default Hotel;
