# Hotel Booking System

A modern, full-stack hotel booking application built with React, Node.js, Express, and MongoDB.

## Features

- **User Authentication**: Secure login/signup with JWT tokens
- **Hotel Search & Filtering**: Search by location, category, amenities, and more
- **Category-based Browsing**: Luxury, Business, Resort, and Boutique hotels
- **Room Booking**: Complete booking flow with date selection and payment
- **User Profile Management**: Edit profile and view booking history
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Search**: Debounced search with instant results

## Tech Stack

### Frontend
- React 18 with Vite
- React Router DOM for navigation
- Tailwind CSS for styling
- Axios for API calls
- Lucide React for icons

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- CORS for cross-origin requests
- Helmet for security
- Swagger for API documentation

## Getting Started

### Prerequisites
- Node.js (>=18.0.0)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hotel-booking-system
   ```

2. **Install Backend Dependencies**
   ```bash
   cd Backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../Front-End
   npm install
   ```

4. **Set up Environment Variables**
   
   Create a `.env` file in the Backend directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017
   DB_NAME=hotel_booking_db
   PORT=5500
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   JWT_SECRET=your_jwt_secret_key_here
   ```

5. **Import Hotel Data**
   ```bash
   cd Backend
   npm run import-hotels
   ```

6. **Start the Development Servers**

   Backend (Terminal 1):
   ```bash
   cd Backend
   npm run dev
   ```

   Frontend (Terminal 2):
   ```bash
   cd Front-End
   npm run dev
   ```

7. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5500
   - API Documentation: http://localhost:5500/api-docs

## Project Structure

```
hotel-booking-system/
├── Backend/
│   ├── src/
│   │   ├── controllers/     # API route handlers
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   └── config/          # Configuration files
│   ├── hotels_data_indian.json  # Sample hotel data
│   └── import_hotels.js     # Data import script
├── Front-End/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API service functions
│   │   ├── hooks/           # Custom React hooks
│   │   └── utils/           # Utility functions
│   └── public/              # Static assets
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/users/signup` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Hotels
- `GET /api/hotels/allhotels` - Get all hotels
- `GET /api/hotels/featured` - Get featured hotels
- `GET /api/hotels/search` - Search hotels
- `GET /api/hotels/:id` - Get hotel by ID

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/users/bookings` - Get user bookings

## Deployment

### Backend Deployment
1. Set production environment variables
2. Build the application: `npm run build`
3. Start the server: `npm start`

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting service

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

