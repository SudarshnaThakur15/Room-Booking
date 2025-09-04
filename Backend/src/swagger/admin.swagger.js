/**
 * @swagger
 * components:
 *   schemas:
 *     HotelCreateRequest:
 *       type: object
 *       required:
 *         - name
 *         - location
 *         - description
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the hotel
 *         location:
 *           type: string
 *           description: The location of the hotel
 *         description:
 *           type: string
 *           description: The description of the hotel
 *         rating:
 *           type: number
 *           format: float
 *           description: The rating of the hotel
 *         amenities:
 *           type: array
 *           items:
 *             type: string
 *           description: List of hotel amenities
 *         price_range:
 *           type: string
 *           enum: ['$', '$$', '$$$', '$$$$']
 *           description: The price range of the hotel
 *         contact:
 *           type: object
 *           properties:
 *             phone:
 *               type: string
 *               description: Hotel phone number
 *             email:
 *               type: string
 *               format: email
 *               description: Hotel email
 *         businessHours:
 *           type: object
 *           properties:
 *             checkIn:
 *               type: string
 *               description: Check-in time
 *             checkOut:
 *               type: string
 *               description: Check-out time
 *         basePrice:
 *           type: number
 *           description: Base price per night
 *         featured:
 *           type: boolean
 *           description: Whether the hotel is featured
 *         verified:
 *           type: boolean
 *           description: Whether the hotel is verified
 *         isActive:
 *           type: boolean
 *           description: Whether the hotel is active
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: List of hotel image URLs
 *     HotelUpdateRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the hotel
 *         location:
 *           type: string
 *           description: The location of the hotel
 *         description:
 *           type: string
 *           description: The description of the hotel
 *         rating:
 *           type: number
 *           format: float
 *           description: The rating of the hotel
 *         amenities:
 *           type: array
 *           items:
 *             type: string
 *           description: List of hotel amenities
 *         price_range:
 *           type: string
 *           enum: ['$', '$$', '$$$', '$$$$']
 *           description: The price range of the hotel
 *         contact:
 *           type: object
 *           properties:
 *             phone:
 *               type: string
 *               description: Hotel phone number
 *             email:
 *               type: string
 *               format: email
 *               description: Hotel email
 *         businessHours:
 *           type: object
 *           properties:
 *             checkIn:
 *               type: string
 *               description: Check-in time
 *             checkOut:
 *               type: string
 *               description: Check-out time
 *         basePrice:
 *           type: number
 *           description: Base price per night
 *         featured:
 *           type: boolean
 *           description: Whether the hotel is featured
 *         verified:
 *           type: boolean
 *           description: Whether the hotel is verified
 *         isActive:
 *           type: boolean
 *           description: Whether the hotel is active
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: List of hotel image URLs
 *     AdminStats:
 *       type: object
 *       properties:
 *         totalHotels:
 *           type: integer
 *           description: Total number of hotels
 *         totalUsers:
 *           type: integer
 *           description: Total number of users
 *         totalBookings:
 *           type: integer
 *           description: Total number of bookings
 *         activeBookings:
 *           type: integer
 *           description: Number of active bookings
 *         revenue:
 *           type: number
 *           description: Total revenue
 *         featuredHotels:
 *           type: integer
 *           description: Number of featured hotels
 *         verifiedHotels:
 *           type: integer
 *           description: Number of verified hotels
 */

/**
 * @swagger
 * /api/admin/hotels:
 *   post:
 *     summary: Create a new hotel (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HotelCreateRequest'
 *     responses:
 *       201:
 *         description: Hotel created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Hotel created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Hotel'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/admin/hotels:
 *   get:
 *     summary: Get all hotels with admin details (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of hotels per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: ['active', 'inactive', 'all']
 *         description: Filter hotels by status
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Filter by featured status
 *       - in: query
 *         name: verified
 *         schema:
 *           type: boolean
 *         description: Filter by verified status
 *     responses:
 *       200:
 *         description: Hotels retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Hotels retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Hotel'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalHotels:
 *                       type: integer
 *                     hasNext:
 *                       type: boolean
 *                     hasPrev:
 *                       type: boolean
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/admin/hotels/{hotelId}:
 *   get:
 *     summary: Get hotel by ID with admin details (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hotelId
 *         required: true
 *         schema:
 *           type: string
 *         description: Hotel ID
 *     responses:
 *       200:
 *         description: Hotel retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Hotel retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Hotel'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Hotel not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/admin/hotels/{hotelId}:
 *   put:
 *     summary: Update hotel by ID (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hotelId
 *         required: true
 *         schema:
 *           type: string
 *         description: Hotel ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HotelUpdateRequest'
 *     responses:
 *       200:
 *         description: Hotel updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Hotel updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Hotel'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Hotel not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/admin/hotels/{hotelId}:
 *   delete:
 *     summary: Delete hotel by ID (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hotelId
 *         required: true
 *         schema:
 *           type: string
 *         description: Hotel ID
 *     responses:
 *       200:
 *         description: Hotel deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Hotel deleted successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     deletedHotelId:
 *                       type: string
 *                       description: ID of the deleted hotel
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Hotel not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/admin/hotels/{hotelId}/featured:
 *   put:
 *     summary: Toggle featured status of a hotel (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hotelId
 *         required: true
 *         schema:
 *           type: string
 *         description: Hotel ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - featured
 *             properties:
 *               featured:
 *                 type: boolean
 *                 description: Featured status to set
 *     responses:
 *       200:
 *         description: Featured status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Featured status updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Hotel'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Hotel not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get admin dashboard statistics (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Statistics retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/AdminStats'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */


