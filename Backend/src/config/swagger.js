import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hotel Booking System API',
      version: '1.0.0',
      description: 'A comprehensive API for hotel booking system with user management, hotel operations, and booking functionality',
      contact: {
        name: 'API Support',
        email: 'support@hotelbooking.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development server'
      },
      {
        url: 'https://api.hotelbooking.com/api',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            _id: {
              type: 'string',
              description: 'User ID'
            },
            username: {
              type: 'string',
              description: 'Username'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email'
            },
            firstName: {
              type: 'string',
              description: 'First name'
            },
            lastName: {
              type: 'string',
              description: 'Last name'
            },
            role: {
              type: 'string',
              enum: ['customer', 'admin'],
              description: 'User role'
            },
            phone: {
              type: 'string',
              description: 'Phone number'
            },
            address: {
              type: 'string',
              description: 'Address'
            },
            dateOfBirth: {
              type: 'string',
              format: 'date',
              description: 'Date of birth'
            },
            isActive: {
              type: 'boolean',
              description: 'Account status'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation date'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update date'
            }
          }
        },
        Hotel: {
          type: 'object',
          required: ['name', 'location', 'description'],
          properties: {
            _id: {
              type: 'string',
              description: 'Hotel ID'
            },
            name: {
              type: 'string',
              description: 'Hotel name'
            },
            location: {
              type: 'string',
              description: 'Hotel location'
            },
            description: {
              type: 'string',
              description: 'Hotel description'
            },
            rating: {
              type: 'number',
              minimum: 0,
              maximum: 5,
              description: 'Hotel rating'
            },
            amenities: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Hotel amenities'
            },
            price_range: {
              type: 'string',
              enum: ['$', '$$', '$$$', '$$$$'],
              description: 'Price range'
            },
            contact: {
              type: 'object',
              properties: {
                phone: {
                  type: 'string'
                },
                email: {
                  type: 'string',
                  format: 'email'
                }
              }
            },
            businessHours: {
              type: 'object',
              properties: {
                checkIn: {
                  type: 'string'
                },
                checkOut: {
                  type: 'string'
                }
              }
            },
            basePrice: {
              type: 'number',
              description: 'Base price per night'
            },
            images: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Hotel images'
            },
            featured: {
              type: 'boolean',
              description: 'Featured hotel status'
            },
            verified: {
              type: 'boolean',
              description: 'Verification status'
            },
            isActive: {
              type: 'boolean',
              description: 'Active status'
            },
            rooms: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Room'
              }
            }
          }
        },
        Room: {
          type: 'object',
          required: ['type', 'name', 'price'],
          properties: {
            _id: {
              type: 'string',
              description: 'Room ID'
            },
            type: {
              type: 'string',
              description: 'Room type'
            },
            name: {
              type: 'string',
              description: 'Room name'
            },
            roomNumber: {
              type: 'string',
              description: 'Room number'
            },
            floor: {
              type: 'number',
              description: 'Floor number'
            },
            capacity: {
              type: 'number',
              description: 'Room capacity'
            },
            bedType: {
              type: 'string',
              description: 'Bed type'
            },
            price: {
              type: 'number',
              description: 'Room price per night'
            },
            amenities: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Room amenities'
            },
            description: {
              type: 'string',
              description: 'Room description'
            },
            pictures: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Room pictures'
            },
            isAvailable: {
              type: 'boolean',
              description: 'Availability status'
            },
            maintenanceMode: {
              type: 'boolean',
              description: 'Maintenance mode'
            }
          }
        },
        Booking: {
          type: 'object',
          required: ['userId', 'hotelId', 'roomId', 'checkInDate', 'checkOutDate'],
          properties: {
            _id: {
              type: 'string',
              description: 'Booking ID'
            },
            userId: {
              type: 'string',
              description: 'User ID'
            },
            hotelId: {
              type: 'string',
              description: 'Hotel ID'
            },
            roomId: {
              type: 'string',
              description: 'Room ID'
            },
            checkInDate: {
              type: 'string',
              format: 'date',
              description: 'Check-in date'
            },
            checkOutDate: {
              type: 'string',
              format: 'date',
              description: 'Check-out date'
            },
            guests: {
              type: 'number',
              description: 'Number of guests'
            },
            totalPrice: {
              type: 'number',
              description: 'Total booking price'
            },
            status: {
              type: 'string',
              enum: ['pending', 'confirmed', 'checked_in', 'checked_out', 'completed', 'cancelled'],
              description: 'Booking status'
            },
            guestDetails: {
              type: 'object',
              properties: {
                firstName: {
                  type: 'string'
                },
                lastName: {
                  type: 'string'
                },
                email: {
                  type: 'string',
                  format: 'email'
                },
                phone: {
                  type: 'string'
                },
                specialRequests: {
                  type: 'string'
                }
              }
            },
            payment: {
              type: 'object',
              properties: {
                method: {
                  type: 'string'
                },
                status: {
                  type: 'string',
                  enum: ['pending', 'completed', 'failed', 'refunded']
                },
                amount: {
                  type: 'number'
                },
                transactionId: {
                  type: 'string'
                }
              }
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation date'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message'
            },
            error: {
              type: 'string',
              description: 'Detailed error information'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Success message'
            },
            data: {
              type: 'object',
              description: 'Response data'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './src/swagger/*.js'
  ]
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
