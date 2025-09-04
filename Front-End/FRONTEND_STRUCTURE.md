# Hotel Booking Frontend - Project Structure

## Overview
This is a modern, production-ready React frontend for a Hotel Booking System with proper separation of concerns, custom hooks, context management, and service layer architecture.

## Folder Structure

```
Front-End/
├── src/
│   ├── components/
│   │   ├── forms/           # Form components
│   │   │   ├── Login.jsx
│   │   │   ├── signup.jsx
│   │   │   └── Profile.jsx
│   │   ├── layout/          # Layout components
│   │   │   ├── navbar.jsx
│   │   │   └── footer.jsx
│   │   ├── ui/              # Reusable UI components
│   │   │   ├── Datepicker.jsx
│   │   │   └── Payscreen.jsx
│   │   ├── Home.jsx         # Main page component
│   │   ├── Hotelcard.jsx    # Hotel display component
│   │   └── Roomcard.jsx     # Room display component
│   ├── context/
│   │   └── AuthContext.jsx  # Authentication context
│   ├── hooks/
│   │   └── useHotels.js     # Custom hook for hotels
│   ├── services/
│   │   ├── api.js           # Base API configuration
│   │   ├── hotelService.js  # Hotel API services
│   │   └── userService.js   # User API services
│   ├── utils/               # Utility functions
│   ├── types/               # TypeScript types (if using TS)
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── package.json
├── vite.config.js
├── tailwind.config.js
└── FRONTEND_STRUCTURE.md    # This file
```

## Architecture Principles

### 1. Component Organization
- **Forms**: Authentication and user input components
- **Layout**: Navigation and structural components
- **UI**: Reusable, presentational components
- **Pages**: Main page components with business logic

### 2. Service Layer
- **API Service**: Centralized HTTP client with interceptors
- **Domain Services**: Business logic for hotels, users, etc.
- **Error Handling**: Consistent error handling across services

### 3. State Management
- **Context API**: Global state for authentication
- **Custom Hooks**: Local state management for specific features
- **Local Storage**: Persistent user data

### 4. Data Flow
- Components → Custom Hooks → Services → API
- Clean separation between UI and business logic

## Key Features

### Authentication System
- JWT token management
- Protected routes
- User context across the app
- Automatic token refresh handling

### Hotel Management
- Hotel listing with search
- Room availability
- User activity tracking
- Responsive grid layout

### Modern UI/UX
- Tailwind CSS for styling
- Responsive design
- Loading states
- Error handling
- Modal components

## Component Details

### Core Components
- **Home**: Main hotel listing page with search
- **HotelCard**: Individual hotel display with room modal
- **RoomCard**: Room information and booking
- **Navbar**: Navigation with authentication status
- **Footer**: Site footer

### Form Components
- **Login**: User authentication
- **Signup**: User registration
- **Profile**: User profile management

### Layout Components
- **Navbar**: Top navigation bar
- **Footer**: Bottom footer
- **App**: Main app wrapper with routing

## Custom Hooks

### useHotels
- Manages hotel data fetching
- Handles loading and error states
- Provides search functionality
- Automatic refetch capabilities

## Services

### API Service
- Axios instance with interceptors
- Automatic token management
- Error handling and redirects
- Request/response logging

### Hotel Service
- CRUD operations for hotels
- Search and filtering
- Room management

### User Service
- Authentication operations
- User profile management
- Activity tracking

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm or yarn
- Backend API running

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

## Environment Variables

Create a `.env` file with:
- `VITE_API_URL`: Backend API URL (e.g., http://localhost:5000)

## Best Practices Implemented

1. **Code Organization**: Clear separation of concerns
2. **Reusability**: Custom hooks and services
3. **Error Handling**: Comprehensive error management
4. **Performance**: Optimized re-renders and API calls
5. **Accessibility**: Proper ARIA labels and keyboard navigation
6. **Responsive Design**: Mobile-first approach
7. **State Management**: Efficient state updates
8. **API Management**: Centralized service layer

## Deployment Ready Features

- Environment-based configuration
- Build optimization
- Error boundaries
- Loading states
- Responsive design
- Modern React patterns
- Service worker ready
- SEO friendly

## Future Enhancements

- TypeScript integration
- Unit testing with Jest/Vitest
- E2E testing with Playwright
- PWA capabilities
- Performance monitoring
- Analytics integration
- Internationalization
- Dark mode support 