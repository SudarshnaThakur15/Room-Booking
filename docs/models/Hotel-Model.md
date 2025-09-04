# Hotel Model Documentation

**Author:** Sudarshna  
**Model Type:** Core Hotel Management & Business Intelligence  
**File:** `Backend/src/models/hotel.model.js`

## 🎯 **Purpose & Overview**

The Hotel model is the central entity for hotel management in the Hotel Booking System. It's designed to handle comprehensive hotel information, room management, business metrics, and admin operations. The model supports both customer-facing features and admin management capabilities, enabling efficient hotel operations and data-driven business decisions.

## 🏗️ **Model Structure**

### **Core Hotel Information**
```javascript
{
  name: String,              // Hotel name (required, max 255 chars)
  location: String,          // Hotel location (required, max 255 chars)
  description: String,       // Detailed hotel description
  rating: Number,            // Hotel rating (0-5 scale)
  isActive: Boolean,         // Hotel availability status
  featured: Boolean,         // Featured hotel flag
  verified: Boolean          // Verification status
}
```

### **Enhanced Room Management**
```javascript
rooms: [{
  type: String,              // Room type (deluxe, semi-deluxe, non-deluxe, suite, presidential, standard)
  name: String,              // Room name/identifier
  roomNumber: String,        // Physical room number
  floor: Number,             // Floor location
  capacity: Number,          // Guest capacity
  bedType: String,           // Bed configuration
  price: Number,             // Current room price (required)
  basePrice: Number,         // Base room price
  isAvailable: Boolean,      // Room availability status
  maintenanceMode: Boolean,  // Maintenance flag
  amenities: [String],       // Room-specific amenities
  description: String,       // Room description
  pictures: [String],        // Room images
  totalBookings: Number,     // Total bookings for this room
  averageRating: Number,     // Average room rating
  reviewCount: Number        // Number of reviews
}]
```

### **Business Intelligence & Metrics**
```javascript
{
  totalBookings: Number,     // Total hotel bookings
  totalRevenue: Number,      // Total revenue generated
  averageRating: Number,     // Average hotel rating
  reviewCount: Number,       // Total number of reviews
  occupancyRate: Number,     // Current occupancy percentage
  createdAt: Date,           // Hotel creation date
  updatedAt: Date            // Last update timestamp
}
```

### **Enhanced Contact & Location**
```javascript
contact: {
  phone: [Number],           // Multiple phone numbers
  email: String,             // Contact email
  address: String,           // Street address
  city: String,              // City name
  state: String,             // State/province
  country: String,           // Country
  postalCode: String,        // Postal/ZIP code
  website: String,           // Hotel website
  coordinates: {
    latitude: Number,        // GPS latitude
    longitude: Number        // GPS longitude
  }
}
```

### **Business Operations**
```javascript
{
  businessHours: {
    checkIn: String,         // Check-in time
    checkOut: String,        // Check-out time
    frontDesk: String        // Front desk hours
  },
  amenities: [String],       // Hotel amenities (array)
  price_range: String,       // Price range category
  basePrice: Number,         // Base hotel price
  seasonalPricing: [{        // Dynamic pricing
    season: String,          // Season name
    price: Number,           // Seasonal price
    startDate: Date,         // Season start
    endDate: Date            // Season end
  }]
}
```

### **Admin Management**
```javascript
{
  createdBy: ObjectId,       // Admin who created the hotel
  lastUpdatedBy: ObjectId,   // Admin who last updated
  images: [String],          // Hotel images (array)
  verified: Boolean          // Verification status
}
```

## 🏨 **Room Management System**

### **Room Classification**
1. **`deluxe`** - Premium luxury rooms
2. **`semi-deluxe`** - Mid-range luxury rooms
3. **`non-deluxe`** - Standard rooms
4. **`suite`** - Multi-room suites
5. **`presidential`** - Highest luxury tier
6. **`standard`** - Basic accommodation

### **Room Features**
- **Capacity Management:** Track guest capacity per room
- **Bed Configuration:** Different bed types and arrangements
- **Amenity Tracking:** Room-specific features and services
- **Maintenance Mode:** Track rooms under maintenance
- **Performance Metrics:** Booking counts and ratings

### **Pricing Strategy**
- **Base Pricing:** Standard room rates
- **Seasonal Pricing:** Dynamic pricing based on seasons
- **Availability Tracking:** Real-time room availability
- **Revenue Optimization:** Track room performance

## 📊 **Business Intelligence Features**

### **Performance Metrics**
- **Booking Analytics:** Total bookings, success rates
- **Revenue Tracking:** Total revenue, average booking value
- **Occupancy Management:** Real-time occupancy rates
- **Rating Analysis:** Customer satisfaction metrics
- **Review Management:** Customer feedback tracking

### **Operational Insights**
- **Room Utilization:** Track room usage patterns
- **Revenue per Room:** Individual room performance
- **Seasonal Trends:** Identify peak and off-peak periods
- **Customer Preferences:** Popular room types and amenities

## 🔄 **Data Relationships**

### **Embedded Documents**
- **Rooms:** Embedded room documents for fast access
- **Seasonal Pricing:** Embedded pricing for quick lookups
- **Business Hours:** Embedded operational information

### **References**
- **Created By:** Reference to admin user
- **Last Updated By:** Reference to admin user
- **Room Bookings:** Referenced through booking model

### **Population Strategy**
- **Room Data:** Embedded for fast hotel queries
- **Admin References:** Populated when needed
- **Performance Metrics:** Calculated and cached

## ⚡ **Performance Optimizations**

### **Database Indexes**
- **Hotel Name:** Indexed for search queries
- **Location:** Indexed for location-based searches
- **Rating:** Indexed for rating-based filtering
- **Price Range:** Indexed for price-based queries
- **Active Status:** Indexed for availability queries

### **Embedded vs. Referenced**
- **Rooms:** Embedded for fast hotel queries
- **Admin Users:** Referenced for user management
- **Bookings:** Referenced for booking history

## 🚀 **Admin Management Capabilities**

### **Hotel Operations**
- **CRUD Operations:** Create, read, update, delete hotels
- **Room Management:** Add, modify, remove rooms
- **Pricing Control:** Set and modify room prices
- **Availability Management:** Control hotel and room availability
- **Image Management:** Upload and manage hotel images

### **Business Intelligence**
- **Performance Monitoring:** Track hotel performance metrics
- **Revenue Analysis:** Analyze revenue patterns
- **Occupancy Tracking:** Monitor room utilization
- **Customer Insights:** Analyze customer preferences

## 📈 **Analytics & Reporting**

### **Hotel Performance**
- **Booking Trends:** Track booking patterns over time
- **Revenue Analysis:** Monitor revenue growth and trends
- **Occupancy Rates:** Track room utilization efficiency
- **Customer Satisfaction:** Monitor ratings and reviews

### **Operational Metrics**
- **Room Performance:** Individual room booking rates
- **Seasonal Analysis:** Peak and off-peak performance
- **Amenity Popularity:** Track most requested features
- **Location Performance:** Geographic performance analysis

## 🔮 **Future Enhancements**

### **Advanced Features**
- **Multi-language Support:** Internationalization
- **Virtual Tours:** 360-degree room views
- **Real-time Availability:** Live room status updates
- **Dynamic Pricing:** AI-powered pricing optimization
- **Inventory Management:** Advanced room inventory tracking

### **Integration Capabilities**
- **Channel Management:** OTA integration
- **Payment Gateways:** Multiple payment options
- **Review Platforms:** External review integration
- **Social Media:** Social sharing and engagement

## 📝 **Usage Examples**

### **Creating a New Hotel**
```javascript
const newHotel = new Hotel({
  name: 'Grand Luxury Hotel',
  location: 'Downtown City Center',
  description: '5-star luxury accommodation',
  amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant'],
  contact: {
    phone: [1234567890],
    email: 'info@grandluxury.com',
    address: '123 Luxury Street'
  }
});
```

### **Adding a Room**
```javascript
hotel.rooms.push({
  type: 'deluxe',
  name: 'Deluxe Suite',
  roomNumber: '201',
  floor: 2,
  capacity: 4,
  bedType: 'King + 2 Twin',
  price: 299,
  amenities: ['WiFi', 'Mini Bar', 'Ocean View']
});
```

### **Updating Hotel Status**
```javascript
hotel.isActive = false;
hotel.maintenanceMode = true;
hotel.updatedAt = new Date();
await hotel.save();
```

## 🎉 **Summary**

The Hotel model provides a comprehensive solution for:
- **Complete Hotel Management** with detailed information
- **Advanced Room Management** with classification and pricing
- **Business Intelligence** with performance metrics and analytics
- **Admin Operations** with full CRUD capabilities
- **Performance Optimization** with strategic indexing and embedding
- **Scalable Architecture** for future enhancements

This model serves as the foundation for hotel operations, enabling efficient management, data-driven decisions, and exceptional customer experiences in the Hotel Booking System.






