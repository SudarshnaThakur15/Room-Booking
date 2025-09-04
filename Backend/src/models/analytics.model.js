import { Schema, model } from 'mongoose';

// User behavior tracking for recommendations
const UserBehaviorSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
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
  action: { 
    type: String,
    enum: ['viewed', 'searched', 'booked', 'cancelled', 'rated', 'favorited'],
    required: true
  },
  searchQuery: String,
  filters: Schema.Types.Mixed, // Price range, amenities, location, etc.
  sessionId: String,
  timestamp: { type: Date, default: Date.now },
  metadata: Schema.Types.Mixed // Additional context
});

// Hotel performance metrics
const HotelMetricsSchema = new Schema({
  hotelId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Hotel',
    required: true 
  },
  date: { type: Date, required: true },
  
  // View metrics
  totalViews: { type: Number, default: 0 },
  uniqueViews: { type: Number, default: 0 },
  
  // Booking metrics
  totalBookings: { type: Number, default: 0 },
  confirmedBookings: { type: Number, default: 0 },
  cancelledBookings: { type: Number, default: 0 },
  
  // Revenue metrics
  totalRevenue: { type: Number, default: 0 },
  averageBookingValue: { type: Number, default: 0 },
  
  // Rating metrics
  averageRating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  
  // Occupancy metrics
  totalRooms: { type: Number, default: 0 },
  occupiedRooms: { type: Number, default: 0 },
  occupancyRate: { type: Number, default: 0 }
});

// Recommendation data
const RecommendationSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  hotelId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Hotel',
    required: true 
  },
  score: { type: Number, required: true }, // Recommendation score (0-1)
  algorithm: { 
    type: String,
    enum: ['content_based', 'collaborative', 'hybrid', 'popularity'],
    required: true
  },
  reason: String, // Why this hotel was recommended
  generatedAt: { type: Date, default: Date.now },
  clicked: { type: Boolean, default: false },
  clickedAt: Date
});

// Business analytics
const BusinessAnalyticsSchema = new Schema({
  date: { type: Date, required: true },
  
  // Overall metrics
  totalUsers: { type: Number, default: 0 },
  activeUsers: { type: Number, default: 0 },
  newUsers: { type: Number, default: 0 },
  
  // Booking metrics
  totalBookings: { type: Number, default: 0 },
  confirmedBookings: { type: Number, default: 0 },
  cancelledBookings: { type: Number, default: 0 },
  noShows: { type: Number, default: 0 },
  
  // Revenue metrics
  totalRevenue: { type: Number, default: 0 },
  averageOrderValue: { type: Number, default: 0 },
  refunds: { type: Number, default: 0 },
  
  // Hotel metrics
  totalHotels: { type: Number, default: 0 },
  activeHotels: { type: Number, default: 0 },
  totalRooms: { type: Number, default: 0 },
  availableRooms: { type: Number, default: 0 },
  
  // User engagement
  totalSearches: { type: Number, default: 0 },
  totalHotelViews: { type: Number, default: 0 },
  averageSessionDuration: { type: Number, default: 0 },
  
  // Performance metrics
  conversionRate: { type: Number, default: 0 }, // Views to bookings
  cancellationRate: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 }
});

// Search analytics
const SearchAnalyticsSchema = new Schema({
  date: { type: Date, required: true },
  searchQuery: String,
  filters: Schema.Types.Mixed,
  resultsCount: Number,
  clickedResults: [{
    hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel' },
    position: Number,
    clicked: Boolean
  }],
  sessionId: String,
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now }
});

// Create indexes for better performance
UserBehaviorSchema.index({ userId: 1, timestamp: -1 });
UserBehaviorSchema.index({ hotelId: 1, timestamp: -1 });
UserBehaviorSchema.index({ action: 1, timestamp: -1 });

HotelMetricsSchema.index({ hotelId: 1, date: -1 });
HotelMetricsSchema.index({ date: 1 });

RecommendationSchema.index({ userId: 1, score: -1 });
RecommendationSchema.index({ hotelId: 1, score: -1 });

BusinessAnalyticsSchema.index({ date: 1 });

SearchAnalyticsSchema.index({ date: 1, searchQuery: 1 });
SearchAnalyticsSchema.index({ userId: 1, timestamp: -1 });

// Create models
const UserBehavior = model('UserBehavior', UserBehaviorSchema);
const HotelMetrics = model('HotelMetrics', HotelMetricsSchema);
const Recommendation = model('Recommendation', RecommendationSchema);
const BusinessAnalytics = model('BusinessAnalytics', BusinessAnalyticsSchema);
const SearchAnalytics = model('SearchAnalytics', SearchAnalyticsSchema);

export {
  UserBehavior,
  HotelMetrics,
  Recommendation,
  BusinessAnalytics,
  SearchAnalytics
};
