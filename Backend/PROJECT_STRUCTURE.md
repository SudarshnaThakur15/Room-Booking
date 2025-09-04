# Hotel Booking System - Full Stack Project Structure

## Overview
This is a modern, production-ready full-stack Hotel Booking System with React frontend and Node.js backend, featuring proper separation of concerns, security middleware, and scalable architecture.

## Project Structure

```
Mithya_P/
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── config.js          # Configuration management
│   │   ├── controllers/
│   │   │   ├── userController.js   # User business logic
│   │   │   ├── hotelController.js  # Hotel business logic
│   │   │   └── bookingController.js # Booking business logic
│   │   ├── middleware/
│   │   │   ├── auth.js            # Authentication & authorization
│   │   │   ├── validation.js      # Request validation
│   │   │   └── errorHandler.js    # Error handling
│   │   ├── models/
│   │   │   ├── user.model.js      # User data model
│   │   │   ├── hotel.model.js     # Hotel data model
│   │   │   └── roomBooking.model.js # Booking data model
│   │   ├── routes/
│   │   │   ├── user.routes.js     # User API endpoints
│   │   │   ├── hotel.routes.js    # Hotel API endpoints
│   │   │   └── booking.routes.js  # Booking API endpoints
│   │   └── connection.js          # Database connection
│   ├── index.js                   # Main server file
│   ├── package.json               # Dependencies & scripts
│   └── PROJECT_STRUCTURE.md       # This file
│
└── Front-End/
    ├── public/
    │   ├── index.html
    │   └── favicon.ico
    ├── src/
    │   ├── components/
    │   │   ├── Home.jsx           # Main homepage component
    │   │   ├── Home_clean.jsx     # Clean version of homepage
    │   │   ├── Home_old.jsx       # Legacy homepage version
    │   │   ├── SearchBar.jsx      # Search functionality component
    │   │   ├── Hotelcard.jsx      # Hotel card display component
    │   │   ├── layout/
    │   │   │   └── footer.jsx     # Footer component
    │   │   └── ...                # Other components
    │   ├── services/
    │   │   └── hotelService.js    # API service layer
    │   ├── App.js                 # Main App component
    │   ├── index.js               # React entry point
    │   └── ...                    # Other frontend files
    ├── package.json               # Frontend dependencies
    └── ...                        # Other frontend files
```

## Architecture Principles

### 1. Separation of Concerns
- **Models**: Data structure and database schemas
- **Controllers**: Business logic and request handling
- **Routes**: API endpoint definitions
- **Middleware**: Cross-cutting concerns (auth, validation, error handling)

### 2. Security Features
- JWT-based authentication
- Role-based authorization (customer/admin)
- Rate limiting
- Helmet security headers
- CORS configuration
- Input validation

### 3. Error Handling
- Centralized error handling
- Proper HTTP status codes
- Validation error messages
- Development vs production error details

## API Endpoints

### Public Routes
- `POST /api/users/signup` - User registration
- `POST /api/users/login` - User authentication
- `GET /api/hotels/allhotels` - Get all hotels
- `GET /api/hotels/search` - Search hotels
- `GET /api/hotels/:id` - Get hotel by ID

### Protected Routes (Customer)
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/activities` - Add user activity
- `GET /api/users/activities` - Get user activities
- `POST /api/bookings` - Create booking
- `GET /api/bookings/user` - Get user bookings
- `PUT /api/bookings/:id/status` - Update booking status
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Admin Routes
- `POST /api/hotels` - Create hotel
- `PUT /api/hotels/:id` - Update hotel
- `DELETE /api/hotels/:id` - Delete hotel
- `GET /api/bookings/all` - Get all bookings

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- MongoDB
- Environment variables configured
- React development environment

### Backend Setup

#### Installation
```bash
cd Backend
npm install
```

#### Development
```bash
npm run dev
```

#### Production
```bash
npm start
```

### Frontend Setup

#### Installation
```bash
cd Front-End
npm install
```

#### Development
```bash
npm start
```

#### Build for Production
```bash
npm run build
```

### Full Stack Development

#### Running Both Services
1. **Terminal 1 - Backend:**
   ```bash
   cd Backend
   npm run dev
   ```

2. **Terminal 2 - Frontend:**
   ```bash
   cd Front-End
   npm start
   ```

#### Default Ports
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`

## Environment Variables

Create a `.env` file with:
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS

## Features

### Backend Features

#### User Management
- Secure password hashing with bcrypt
- JWT token authentication
- Role-based access control
- User activity tracking

#### Hotel Management
- CRUD operations for hotels
- Room management within hotels
- Search and filtering capabilities
- Image and amenity support

#### Booking System
- Date validation
- Room availability checking
- Booking status management
- User booking history

#### Security
- Input validation and sanitization
- Rate limiting
- Security headers
- CORS protection
- Error handling

### Frontend Features

#### Homepage Components
- **Home.jsx**: Main homepage with search functionality
- **Home_clean.jsx**: Clean version with simplified UI
- **Home_old.jsx**: Legacy version for reference
- **SearchBar.jsx**: Advanced search component with filters

#### Search Functionality
- Real-time search with debouncing
- Location-based search
- Hotel name and description search
- Advanced filtering options (hidden by default)
- Search results displayed directly in featured hotels section
- Navy blue text styling for search inputs

#### User Interface
- Modern, responsive design with Tailwind CSS
- Gradient backgrounds and smooth animations
- Category-based hotel browsing
- Popular destinations showcase
- Hotel card components with ratings and amenities
- Mobile-friendly responsive layout

#### Recent Updates (Latest)
- ✅ Hidden advanced search filters from homepage
- ✅ Removed extra search confirmation step
- ✅ Fixed search functionality synchronization
- ✅ Updated search input text color to navy blue
- ✅ Streamlined search user experience
- ✅ Added debug logging for search troubleshooting

## Best Practices Implemented

1. **Code Organization**: Clear separation of concerns
2. **Error Handling**: Comprehensive error management
3. **Security**: Multiple layers of security
4. **Validation**: Input validation at multiple levels
5. **Logging**: Proper error logging and monitoring
6. **Performance**: Database connection pooling, compression
7. **Scalability**: Modular architecture for easy scaling

## Deployment Ready Features

- Environment-based configuration
- Health check endpoints
- Graceful shutdown handling
- Production error handling
- Security middleware
- Rate limiting
- CORS configuration
- Compression middleware 