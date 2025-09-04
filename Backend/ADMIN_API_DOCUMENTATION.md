# Admin API Documentation

## Overview
This document provides comprehensive documentation for all admin-specific API endpoints in the Hotel Booking System. All admin routes require authentication and admin role authorization.

## Base URL
```
http://localhost:5000/api/admin
```
. how dp this
## Authentication
All admin endpoints require:
1. **JWT Token** in Authorization header: `Authorization: Bearer <token>`
2. **Admin Role** - User must have `role: 'admin'` in their profile

### Headers
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

## API Endpoints

### 🔐 Authentication & Authorization
All routes automatically check for valid JWT token and admin role using middleware.

---

## 🏨 Hotel Management

### Create Hotel
**POST** `/hotels`
```json
{
  "name": "Grand Hotel",
  "location": "New York, NY",
  "description": "Luxury hotel in downtown",
  "rating": 4.5,
  "amenities": ["WiFi", "Pool", "Spa"],
  "price_range": "$$$",
  "contact": {
    "phone": "+1-555-0123",
    "email": "info@grandhotel.com"
  },
  "businessHours": {
    "checkIn": "15:00",
    "checkOut": "11:00"
  },
  "basePrice": 200,
  "seasonalPricing": [
    {
      "season": "summer",
      "multiplier": 1.2
    }
  ],
  "images": ["url1", "url2"]
}
```

### Get All Hotels
**GET** `/hotels?page=1&limit=20&search=hotel&status=true&featured=true&verified=true`

**Query Parameters:**
- `page` (default: 1) - Page number
- `limit` (default: 20) - Items per page
- `search` - Search in name, location, description
- `status` - Filter by active status (true/false)
- `featured` - Filter by featured status (true/false)
- `verified` - Filter by verification status (true/false)

### Get Hotel by ID
**GET** `/hotels/:hotelId`

### Update Hotel
**PUT** `/hotels/:hotelId`
```json
{
  "name": "Updated Hotel Name",
  "description": "Updated description",
  "rating": 4.8
}
```

### Delete Hotel (Soft Delete)
**DELETE** `/hotels/:hotelId`
- Marks hotel as inactive instead of permanent deletion

### Toggle Hotel Status
**PATCH** `/hotels/:hotelId/status`
```json
{
  "isActive": false
}
```

### Toggle Featured Status
**PATCH** `/hotels/:hotelId/featured`
```json
{
  "featured": true
}
```

### Toggle Verification Status
**PATCH** `/hotels/:hotelId/verified`
```json
{
  "verified": true
}
```

---

## 🏠 Room Management

### Add Room to Hotel
**POST** `/hotels/:hotelId/rooms`
```json
{
  "type": "deluxe",
  "name": "Deluxe Suite",
  "roomNumber": "101",
  "floor": 1,
  "capacity": 2,
  "bedType": "king",
  "price": 250,
  "basePrice": 250,
  "amenities": ["WiFi", "TV", "Mini Bar"],
  "description": "Spacious deluxe suite",
  "pictures": ["url1", "url2"]
}
```

### Update Room
**PUT** `/hotels/:hotelId/rooms/:roomId`
```json
{
  "price": 275,
  "description": "Updated room description"
}
```

### Delete Room
**DELETE** `/hotels/:hotelId/rooms/:roomId`
- Only if room has no existing bookings

### Toggle Room Availability
**PATCH** `/hotels/:hotelId/rooms/:roomId/availability`
```json
{
  "isAvailable": false
}
```

### Toggle Room Maintenance
**PATCH** `/hotels/:hotelId/rooms/:roomId/maintenance`
```json
{
  "maintenanceMode": true
}
```

---

## 📊 Hotel Analytics & Metrics

### Get Hotel Performance Metrics
**GET** `/hotels/:hotelId/metrics?period=30d`

**Query Parameters:**
- `period` - Time period: `7d`, `30d`, `90d`, `1y`

**Response includes:**
- Total views, bookings, revenue
- Daily metrics breakdown
- Occupancy rates

### Get Hotel Statistics Overview
**GET** `/hotels/:hotelId/stats`

**Response includes:**
- Room statistics (total, available, maintenance)
- Pricing statistics
- Business metrics

### Bulk Update Hotel Prices
**PATCH** `/hotels/:hotelId/prices/bulk`
```json
{
  "percentageChange": 10
}
```
OR
```json
{
  "priceUpdates": [
    {
      "roomId": "room123",
      "newPrice": 300
    }
  ]
}
```

---

## 📅 Booking Management

### Get All Bookings
**GET** `/bookings?page=1&limit=20&status=confirmed&hotelId=123&startDate=2024-01-01&endDate=2024-12-31&priority=high&assignedTo=admin123`

**Query Parameters:**
- `page`, `limit` - Pagination
- `status` - Booking status filter
- `hotelId` - Filter by specific hotel
- `userId` - Filter by specific user
- `startDate`, `endDate` - Date range filter
- `search` - Search in guest info, special requests
- `priority` - Filter by priority level
- `assignedTo` - Filter by assigned admin

### Get Booking by ID
**GET** `/bookings/:bookingId`

### Update Booking Status
**PATCH** `/bookings/:bookingId/status`
```json
{
  "status": "confirmed",
  "notes": "Payment confirmed",
  "assignedTo": "admin123"
}
```

**Available Statuses:**
- `pending`, `confirmed`, `checked_in`, `checked_out`, `completed`, `cancelled`

### Assign Booking to Admin
**PATCH** `/bookings/:bookingId/assign`
```json
{
  "assignedTo": "admin123"
}
```

### Update Booking Priority
**PATCH** `/bookings/:bookingId/priority`
```json
{
  "priority": "urgent"
}
```

**Priority Levels:**
- `low`, `normal`, `high`, `urgent`

### Cancel Booking
**PATCH** `/bookings/:bookingId/cancel`
```json
{
  "reason": "Guest request",
  "refundAmount": 200,
  "refundStatus": "pending"
}
```

### Process Refund
**PATCH** `/bookings/:bookingId/refund`
```json
{
  "refundStatus": "completed",
  "refundNotes": "Refund processed via credit card"
}
```

### Add Admin Notes
**PATCH** `/bookings/:bookingId/notes`
```json
{
  "notes": "Guest called to confirm arrival time"
}
```

---

## 📈 Booking Analytics & Reporting

### Get Booking Statistics Overview
**GET** `/bookings/stats/overview?period=30d`

**Response includes:**
- Total bookings, revenue, conversion rates
- Status distribution
- Revenue analytics

### Get Revenue Analytics
**GET** `/bookings/analytics/revenue?period=30d&groupBy=day`

**Query Parameters:**
- `period` - Time period
- `groupBy` - Group by: `hour`, `day`, `week`, `month`

### Get Admin Performance Metrics
**GET** `/bookings/analytics/admin-performance?period=30d`

**Response includes:**
- Admin performance statistics
- Confirmation rates
- Revenue generated per admin

### Export Booking Data
**GET** `/bookings/export?format=csv&startDate=2024-01-01&endDate=2024-12-31&status=confirmed`

**Query Parameters:**
- `format` - `json` or `csv`
- `startDate`, `endDate` - Date range
- `status` - Filter by status

---

## 📊 Analytics & Business Intelligence

### Get Business Dashboard
**GET** `/analytics/dashboard?period=30d`

**Response includes:**
- User statistics (total, active, new)
- Booking statistics and revenue
- Hotel statistics
- User behavior patterns
- Search analytics overview

### Get User Behavior Analytics
**GET** `/analytics/user-behavior?period=30d&action=viewed_hotel&userId=123&hotelId=456`

**Query Parameters:**
- `period` - Time period
- `action` - Specific user action
- `userId` - Filter by specific user
- `hotelId` - Filter by specific hotel

**Response includes:**
- Action distribution
- Hourly/daily activity patterns
- Top performing hotels
- Recent activity

### Get Hotel Performance Analytics
**GET** `/analytics/hotel-performance?period=30d&hotelId=123`

**Response includes:**
- Performance summary
- Top performing hotels
- Revenue trends
- Room type performance

### Get Search Analytics
**GET** `/analytics/search?period=30d&searchQuery=hotel`

**Response includes:**
- Search query distribution
- Search trends over time
- Clicked results analysis
- Filter usage statistics

### Get Recommendation System Analytics
**GET** `/analytics/recommendations?period=30d&algorithm=collaborative&userId=123`

**Response includes:**
- Algorithm performance metrics
- Score distribution
- Top recommended hotels
- User engagement statistics

### Export Analytics Data
**GET** `/analytics/export?type=user_behavior&format=csv&startDate=2024-01-01&endDate=2024-12-31&limit=1000`

**Query Parameters:**
- `type` - Analytics type: `user_behavior`, `hotel_metrics`, `search_analytics`, `recommendations`
- `format` - `json` or `csv`
- `startDate`, `endDate` - Date range
- `limit` - Maximum records to export

---

## 👥 User Management

### Create New User
**POST** `/users`
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe",
  "role": "customer",
  "phone": "+1-555-0123",
  "address": "123 Main St",
  "dateOfBirth": "1990-01-01"
}
```

### Get All Users
**GET** `/users?page=1&limit=20&role=customer&status=true&search=john&sortBy=createdAt&sortOrder=desc`

**Query Parameters:**
- `page`, `limit` - Pagination
- `role` - Filter by role: `customer`, `admin`
- `status` - Filter by active status
- `search` - Search in username, email, names
- `sortBy` - Sort field
- `sortOrder` - `asc` or `desc`

### Get User by ID
**GET** `/users/:userId`

### Update User
**PUT** `/users/:userId`
```json
{
  "firstName": "Updated Name",
  "phone": "+1-555-9999",
  "address": "456 New St"
}
```

### Update User Password
**PATCH** `/users/:userId/password`
```json
{
  "newPassword": "newsecurepassword"
}
```

### Delete User (Soft Delete)
**DELETE** `/users/:userId`
- Only if user has no active bookings

### Toggle User Status
**PATCH** `/users/:userId/status`
```json
{
  "isActive": false
}
```

### Update User Role and Permissions
**PATCH** `/users/:userId/role`
```json
{
  "role": "admin",
  "adminPermissions": {
    "canManageHotels": true,
    "canManageBookings": true,
    "canViewAnalytics": true,
    "canManageUsers": true,
    "canViewReports": true
  }
}
```

---

## 🔍 User Analytics & Insights

### Get User Analytics and Behavior
**GET** `/users/:userId/analytics?period=30d`

**Response includes:**
- Behavior statistics
- Hotel interactions
- Search behavior
- Engagement metrics

### Get User Preferences and Recommendations
**GET** `/users/:userId/preferences`

**Response includes:**
- User preferences
- Favorite hotels
- Activity-based preferences
- Price and location preferences

---

## ⚡ Bulk Operations

### Bulk User Operations
**POST** `/users/bulk-operations`
```json
{
  "operation": "activate",
  "userIds": ["user1", "user2", "user3"],
  "data": {}
}
```

**Available Operations:**
- `activate` - Activate multiple users
- `deactivate` - Deactivate multiple users
- `changeRole` - Change role for multiple users
- `updatePermissions` - Update permissions for multiple users

---

## 📤 Data Export

### Export User Data
**GET** `/users/export?format=csv&role=customer&status=true&startDate=2024-01-01&endDate=2024-12-31`

**Query Parameters:**
- `format` - `json` or `csv`
- `role` - Filter by role
- `status` - Filter by status
- `startDate`, `endDate` - Date range

---

## 🏥 System Health & Monitoring

### Get System Health Status
**GET** `/system/health`

**Response includes:**
- System status
- Uptime
- Memory usage
- Environment info

### Get API Usage Statistics
**GET** `/system/api-stats`

---

## 🎯 Admin Dashboard Summary

### Get Dashboard Summary Data
**GET** `/dashboard/summary`

Quick overview for admin dashboard with aggregated data.

---

## 📝 Error Handling

All endpoints return consistent error responses:

### Success Response
```json
{
  "message": "Operation completed successfully",
  "data": {...}
}
```

### Error Response
```json
{
  "message": "Error description",
  "error": "Detailed error information"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access Control** - Admin-only endpoint access
- **Rate Limiting** - Prevents API abuse
- **Input Validation** - Sanitizes all input data
- **CORS Protection** - Cross-origin request security
- **Helmet Security** - HTTP header security

---

## 🚀 Getting Started

1. **Obtain Admin Credentials**
   - Login with admin account to get JWT token
   - Ensure user has `role: 'admin'`

2. **Set Authorization Header**
   ```
   Authorization: Bearer <your-jwt-token>
   ```

3. **Test Endpoints**
   - Start with simple GET requests
   - Verify authentication and authorization
   - Test CRUD operations

4. **Monitor Responses**
   - Check HTTP status codes
   - Review response data structure
   - Handle errors appropriately

---

## 📚 Additional Resources

- **User API Documentation** - For customer-facing endpoints
- **Hotel API Documentation** - For public hotel endpoints
- **Booking API Documentation** - For customer booking endpoints
- **Authentication Guide** - JWT token management
- **Error Codes Reference** - Complete error code list

---

## 🤝 Support

For API support or questions:
- Check error responses for detailed information
- Review request/response examples
- Ensure proper authentication headers
- Verify admin role permissions
