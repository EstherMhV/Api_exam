const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

router
    .route('/register')
    .post(userController.register)


router
    .route('/login')
    .post(userController.login)

router
    .route('/')
    .get(jwtMiddleware.verifyToken,jwtMiddleware.verifyAdmin ,userController.listAllUsers)

router
    .route('/:id_user')
    .put(jwtMiddleware.verifyToken,userController.updateAUser)
    .delete(jwtMiddleware.verifyToken,jwtMiddleware.verifyAdmin ,userController.deleteAUser)
    .get(jwtMiddleware.verifyToken,jwtMiddleware.verifyAdmin ,userController.getAUser)

router
    .route('/:id_user/assignment')
    .get(jwtMiddleware.verifyToken, userController.getAssignment)

module.exports = router;


/**
 * @openapi
 * tags:
 *   name: Users
 *   description: User management and authentication
 */

/**
 * @openapi
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     description: Endpoint to register a new user.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successful operation
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /users/login:
 *   post:
 *     summary: Login a user
 *     description: Endpoint to login a user.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successful operation
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Endpoint to retrieve all users.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successful operation
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /users/{id_user}:
 *   put:
 *     summary: Update a user
 *     description: Endpoint to update an existing user.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id_user
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete a user
 *     description: Endpoint to delete a specific user.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id_user
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *       500:
 *         description: Internal server error
 *   get:
 *     summary: Get a user
 *     description: Endpoint to retrieve a specific user.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id_user
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /users/{id_user}/assignment:
 *   get:
 *     summary: Get a user's assignment
 *     description: Endpoint to retrieve a specific user's assignment.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id_user
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *       500:
 *         description: Internal server error
 */

