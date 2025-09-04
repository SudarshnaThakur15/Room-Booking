/**
 * @swagger
 * components:
 *   schemas:
 *     Success:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Success message
 *         data:
 *           type: object
 *           description: Response data
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *         error:
 *           type: string
 *           description: Error details
 *     ValidationError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Validation failed"
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *                 description: Field that failed validation
 *               message:
 *                 type: string
 *                 description: Validation error message
 *     UnauthorizedError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Unauthorized access"
 *         error:
 *           type: string
 *           example: "Invalid or missing authentication token"
 *     ForbiddenError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Access forbidden"
 *         error:
 *           type: string
 *           example: "Insufficient permissions"
 *     NotFoundError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Resource not found"
 *         error:
 *           type: string
 *           example: "The requested resource does not exist"
 *     ConflictError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Resource conflict"
 *         error:
 *           type: string
 *           example: "Resource already exists or conflicts with existing data"
 *     InternalServerError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Internal server error"
 *         error:
 *           type: string
 *           example: "An unexpected error occurred"
 *     PaginationInfo:
 *       type: object
 *       properties:
 *         currentPage:
 *           type: integer
 *           description: Current page number
 *         totalPages:
 *           type: integer
 *           description: Total number of pages
 *         totalItems:
 *           type: integer
 *           description: Total number of items
 *         itemsPerPage:
 *           type: integer
 *           description: Number of items per page
 *         hasNext:
 *           type: boolean
 *           description: Whether there is a next page
 *         hasPrev:
 *           type: boolean
 *           description: Whether there is a previous page
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: JWT token obtained from login endpoint
 *   responses:
 *     BadRequest:
 *       description: Bad request - validation error
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ValidationError'
 *     Unauthorized:
 *       description: Unauthorized - invalid or missing token
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UnauthorizedError'
 *     Forbidden:
 *       description: Forbidden - insufficient permissions
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForbiddenError'
 *     NotFound:
 *       description: Resource not found
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NotFoundError'
 *     Conflict:
 *       description: Resource conflict
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConflictError'
 *     InternalServerError:
 *       description: Internal server error
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InternalServerError'
 *   parameters:
 *     PageParam:
 *       in: query
 *       name: page
 *       schema:
 *         type: integer
 *         minimum: 1
 *         default: 1
 *       description: Page number for pagination
 *     LimitParam:
 *       in: query
 *       name: limit
 *       schema:
 *         type: integer
 *         minimum: 1
 *         maximum: 100
 *         default: 10
 *       description: Number of items per page
 *     IdParam:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *       description: Resource ID
 *       example: "507f1f77bcf86cd799439011"
 *     HotelIdParam:
 *       in: path
 *       name: hotelId
 *       required: true
 *       schema:
 *         type: string
 *       description: Hotel ID
 *       example: "507f1f77bcf86cd799439011"
 *     UserIdParam:
 *       in: path
 *       name: userId
 *       required: true
 *       schema:
 *         type: string
 *       description: User ID
 *       example: "507f1f77bcf86cd799439011"
 *     BookingIdParam:
 *       in: path
 *       name: bookingId
 *       required: true
 *       schema:
 *         type: string
 *       description: Booking ID
 *       example: "507f1f77bcf86cd799439011"
 *     LocationParam:
 *       in: path
 *       name: location
 *       required: true
 *       schema:
 *         type: string
 *       description: Location name
 *       example: "New York"
 *     PriceRangeParam:
 *       in: path
 *       name: range
 *       required: true
 *       schema:
 *         type: string
 *         enum: ['$', '$$', '$$$', '$$$$']
 *       description: Price range
 *       example: "$$"
 *     AmenityParam:
 *       in: path
 *       name: amenity
 *       required: true
 *       schema:
 *         type: string
 *       description: Amenity name
 *       example: "WiFi"
 *   tags:
 *     - name: Users
 *       description: User authentication and profile management
 *     - name: Hotels
 *       description: Hotel search and information
 *     - name: Bookings
 *       description: Booking management
 *     - name: Admin
 *       description: Administrative operations
 */


