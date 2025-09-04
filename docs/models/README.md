# Hotel Booking System - Data Models

## Overview

This document describes the data models used in the hotel booking system.

## Models

1. **[User Model](User-Model.md)** - User management and authentication
2. **[Hotel Model](Hotel-Model.md)** - Hotel and room information
3. **[Booking Model](Booking-Model.md)** - Reservation management
4. **[Analytics Model](Analytics-Model.md)** - User behavior and analytics

## Model Relationships

```
User ←→ Booking ←→ Hotel
  ↓         ↓         ↓
Analytics ←→ Analytics ←→ Analytics
```

## Data Flow

### User Operations
1. User Registration/Login → User Model
2. Hotel Search → Analytics Model
3. Booking Creation → Booking Model
4. Payment Processing → Booking Model

### Admin Operations
1. Hotel Management → Hotel Model
2. User Management → User Model
3. Booking Management → Booking Model
4. Analytics & Reporting → Analytics Model






