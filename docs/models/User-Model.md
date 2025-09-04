# User Model Documentation

**Author:** Sudarshna  
**Model Type:** Core User Management & Authentication  
**File:** `Backend/src/models/user.model.js`

## 🎯 **Purpose & Overview**

The User model serves as the central entity for user management, authentication, and behavior tracking in the Hotel Booking System. It's designed to handle both customer and admin users with role-based access control, comprehensive activity tracking, and preference management for personalized recommendations.

## 🏗️ **Model Structure**

### **Core User Fields**
```javascript
{
  username: String,        // Unique username for login
  email: String,          // Unique email address
  password: String,       // Hashed password for security
  role: String,           // 'customer' or 'admin'
}
```

### **Enhanced Admin Permissions**
```javascript
adminPermissions: {
  canManageHotels: Boolean,      // Hotel CRUD operations
  canManageBookings: Boolean,    // Booking management
  canViewAnalytics: Boolean,     // Business intelligence access
  canManageUsers: Boolean,       // User management
  canViewReports: Boolean        // Report generation
}
```

### **User Preferences for Recommendations**
```javascript
preferences: {
  favoriteHotels: [ObjectId],    // Array of favorite hotel IDs
  favoriteRoomTypes: [String],   // Preferred room categories
  priceRange: { min: Number, max: Number },
  preferredLocations: [String],  // Favorite destinations
  preferredAmenities: [String],  // Desired hotel features
  travelStyle: String,           // 'budget', 'mid-range', 'luxury', 'business'
  preferredRating: Number        // Minimum hotel rating preference
}
```

### **Enhanced Activity Tracking**
```javascript
activities: [{
  type: String,                  // Activity type (viewed_hotel, booked, etc.)
  hotelId: ObjectId,            // Associated hotel
  roomId: ObjectId,             // Associated room
  searchQuery: String,           // Search terms used
  rating: Number,                // User ratings given
  duration: Number,              // Time spent on page
  sessionId: String,             // Session tracking
  metadata: Mixed,               // Additional context
  date: Date                     // Activity timestamp
}]
```

### **User Analytics & Metrics**
```javascript
{
  totalBookings: Number,         // Total bookings made
  totalSpent: Number,            // Total amount spent
  averageRating: Number,         // Average rating given
  lastActive: Date,              // Last activity timestamp
  isActive: Boolean,             // Account status
  emailVerified: Boolean,        // Email verification status
  lastLogin: Date                // Last login timestamp
}
```

## 🔐 **Security & Authentication Design**

### **Password Security**
- **Hashing:** Uses bcrypt with 10 salt rounds for secure password storage
- **No Plain Text:** Passwords are never stored in plain text
- **JWT Integration:** Generates secure JWT tokens for authentication

### **Role-Based Access Control**
- **Customer Role:** Basic user functionality, booking management
- **Admin Role:** Full system access with granular permissions
- **Permission Inheritance:** Admin users automatically get all permissions

### **Session Management**
- **JWT Tokens:** 24-hour expiration for security
- **Activity Tracking:** Comprehensive user behavior monitoring
- **Last Active:** Tracks user engagement and activity patterns

## 📊 **Activity Tracking System**

### **Activity Types**
1. **`viewed_hotel`** - User viewed hotel details
2. **`viewed_room`** - User viewed specific room
3. **`searched`** - User performed search
4. **`draft_booking`** - User started booking process
5. **`completed_booking`** - Successful booking
6. **`cancelled_booking`** - Cancelled booking
7. **`rated_hotel`** - User rated a hotel
8. **`rated_room`** - User rated a room
9. **`visited`** - User visited hotel page
10. **`favorited_hotel`** - User added hotel to favorites

### **Metadata Collection**
- **Search Filters:** Price ranges, amenities, locations
- **Session Data:** User session tracking
- **Behavior Patterns:** Time spent, interaction patterns
- **Context Information:** Additional user context

## 🎯 **Recommendation System Integration**

### **Preference Learning**
- **Favorite Hotels:** Tracks user's preferred hotels
- **Room Preferences:** Learns preferred room types
- **Price Sensitivity:** Understands user's budget range
- **Location Preferences:** Identifies favorite destinations
- **Travel Style:** Categorizes user preferences

### **Behavior Analysis**
- **Viewing Patterns:** What hotels users explore
- **Search History:** Common search queries
- **Booking Behavior:** Successful vs. abandoned bookings
- **Rating Patterns:** User rating preferences

## 🔄 **Data Relationships**

### **References**
- **Bookings:** Array of booking IDs for user's booking history
- **Favorite Hotels:** Array of hotel IDs for quick access
- **Activities:** Embedded activity documents for performance

### **Population Strategy**
- **Lazy Loading:** Activities are embedded for quick access
- **Reference Population:** Hotels and bookings are populated when needed
- **Indexing:** Optimized queries with strategic database indexes

## ⚡ **Performance Optimizations**

### **Database Indexes**
- **Username & Email:** Unique indexes for fast lookups
- **Role-based Queries:** Indexed for admin/customer filtering
- **Activity Timestamps:** Indexed for chronological queries
- **Preferences:** Indexed for recommendation queries

### **Embedded Documents**
- **Activities:** Embedded for fast access without joins
- **Preferences:** Embedded for quick preference checks
- **Admin Permissions:** Embedded for fast permission validation

## 🚀 **Business Intelligence Features**

### **User Analytics**
- **Engagement Metrics:** Track user activity and engagement
- **Booking Patterns:** Analyze successful vs. failed bookings
- **Revenue Tracking:** Monitor user spending patterns
- **Preference Evolution:** Track changing user preferences

### **Admin Insights**
- **User Segmentation:** Categorize users by behavior
- **Activity Monitoring:** Track user engagement
- **Performance Metrics:** Monitor user satisfaction
- **Trend Analysis:** Identify user behavior trends

## 🔮 **Future Enhancements**

### **Advanced Analytics**
- **Predictive Modeling:** Predict user behavior and preferences
- **Churn Analysis:** Identify users at risk of leaving
- **Lifetime Value:** Calculate user lifetime value
- **Personalization Engine:** Advanced recommendation algorithms

### **Integration Capabilities**
- **Third-party Auth:** OAuth, Google, Facebook integration
- **Social Features:** User reviews, social sharing
- **Notification System:** Push notifications, email alerts
- **Multi-language:** Internationalization support

## 📝 **Usage Examples**

### **Creating a New User**
```javascript
const newUser = new User({
  username: 'john_doe',
  email: 'john@example.com',
  password: hashedPassword,
  firstName: 'John',
  lastName: 'Doe',
  role: 'customer'
});
```

### **Adding User Activity**
```javascript
user.activities.push({
  type: 'viewed_hotel',
  hotelId: hotelId,
  duration: 120,
  sessionId: sessionId,
  date: new Date()
});
```

### **Updating Preferences**
```javascript
user.preferences.priceRange = { min: 100, max: 500 };
user.preferences.travelStyle = 'luxury';
await user.save();
```

## 🎉 **Summary**

The User model is a comprehensive, scalable solution that provides:
- **Secure Authentication** with JWT and bcrypt
- **Role-Based Access Control** for admin functionality
- **Comprehensive Activity Tracking** for user behavior analysis
- **Preference Management** for personalized recommendations
- **Business Intelligence** capabilities for data-driven decisions
- **Performance Optimization** with strategic indexing and embedding

This model serves as the foundation for the entire Hotel Booking System, enabling personalized user experiences, robust admin functionality, and data-driven business insights.






