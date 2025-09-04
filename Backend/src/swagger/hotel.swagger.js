/**
 * @swagger
 * components:
 *   schemas:
 *     Hotel:
 *       type: object
 *       required:
 *         - name
 *         - location
 *         - description
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the hotel
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
 *         rooms:
 *           type: array
 *           items:
 *             type: string
 *           description: List of room IDs
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the hotel was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the hotel was last updated
 *     HotelSearchRequest:
 *       type: object
 *       properties:
 *         query:
 *           type: string
 *           description: Search query for hotel name or description
 *         location:
 *           type: string
 *           description: Location to search in
 *         priceRange:
 *           type: string
 *           enum: ['$', '$$', '$$$', '$$$$']
 *           description: Price range filter
 *         rating:
 *           type: number
 *           description: Minimum rating filter
 *         amenities:
 *           type: array
 *           items:
 *             type: string
 *           description: Required amenities
 */

/**
 * @swagger
 * /api/hotels/allhotels:
 *   get:
 *     summary: Get all hotels
 *     tags: [Hotels]
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
 */

/**
 * @swagger
 * /api/hotels/search:
 *   get:
 *     summary: Search hotels
 *     tags: [Hotels]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Location filter
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Results per page
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Search completed successfully"
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
 *                     totalResults:
 *                       type: integer
 *                     hasNext:
 *                       type: boolean
 *                     hasPrev:
 *                       type: boolean
 */

/**
 * @swagger
 * /api/hotels/search/advanced:
 *   post:
 *     summary: Advanced hotel search
 *     tags: [Hotels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HotelSearchRequest'
 *     responses:
 *       200:
 *         description: Advanced search completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Advanced search completed successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Hotel'
 *                 filters:
 *                   type: object
 *                   description: Applied filters
 *       400:
 *         description: Bad request - invalid search parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/hotels/featured:
 *   get:
 *     summary: Get featured hotels
 *     tags: [Hotels]
 *     responses:
 *       200:
 *         description: Featured hotels retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Featured hotels retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Hotel'
 *                 count:
 *                   type: integer
 *                   description: Number of featured hotels
 */

/**
 * @swagger
 * /api/hotels/location/{location}:
 *   get:
 *     summary: Get hotels by location
 *     tags: [Hotels]
 *     parameters:
 *       - in: path
 *         name: location
 *         required: true
 *         schema:
 *           type: string
 *         description: Location to search for
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Results per page
 *     responses:
 *       200:
 *         description: Hotels by location retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Hotels by location retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Hotel'
 *                 location:
 *                   type: string
 *                   description: The searched location
 *                 count:
 *                   type: integer
 *                   description: Number of hotels found
 *       404:
 *         description: No hotels found in the specified location
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/hotels/price/{range}:
 *   get:
 *     summary: Get hotels by price range
 *     tags: [Hotels]
 *     parameters:
 *       - in: path
 *         name: range
 *         required: true
 *         schema:
 *           type: string
 *           enum: ['$', '$$', '$$$', '$$$$']
 *         description: Price range to filter by
 *     responses:
 *       200:
 *         description: Hotels by price range retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Hotels by price range retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Hotel'
 *                 priceRange:
 *                   type: string
 *                   description: The filtered price range
 *                 count:
 *                   type: integer
 *                   description: Number of hotels found
 *       400:
 *         description: Invalid price range
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/hotels/amenities/{amenity}:
 *   get:
 *     summary: Get hotels by amenity
 *     tags: [Hotels]
 *     parameters:
 *       - in: path
 *         name: amenity
 *         required: true
 *         schema:
 *           type: string
 *         description: Amenity to search for
 *     responses:
 *       200:
 *         description: Hotels by amenity retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Hotels by amenity retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Hotel'
 *                 amenity:
 *                   type: string
 *                   description: The searched amenity
 *                 count:
 *                   type: integer
 *                   description: Number of hotels found
 *       404:
 *         description: No hotels found with the specified amenity
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/hotels/{id}:
 *   get:
 *     summary: Get hotel by ID
 *     tags: [Hotels]
 *     parameters:
 *       - in: path
 *         name: id
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
 *       404:
 *         description: Hotel not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Invalid hotel ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */


