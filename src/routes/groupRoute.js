const express = require('express');
const router = express.Router();

const jwtMiddleware = require('../middlewares/jwtMiddleware');
const groupController = require('../controllers/groupController');


router
    .route('/')
    .get(jwtMiddleware.verifyToken, groupController.listAllGroups)


// Group creation endpoint

router
    .route('/create')
    .post(groupController.createAGroup)


// seul le user admin peut acceder a ces fonctionnalites
router
    .route('/:id_group')
    .put(jwtMiddleware.verifyToken, jwtMiddleware.verifyAdminOrGroupAdmin, groupController.updateAGroup)
    .get(jwtMiddleware.verifyToken, jwtMiddleware.verifyAdminOrGroupAdmin, groupController.getAGroup)

    //sauf cette route ou le propprietaire du groupe peut supprimer le groupe aussi
    .delete(jwtMiddleware.verifyToken, jwtMiddleware.verifyAdminOrGroupAdmin, groupController.deleteGroup)


/// Group invitation endpoint
// ne pas oublié de se relogin avant d'envoyer l'invitation
// apres avoir creer le groupe afin que le token prenne en compte l'id du group

router
    .route('/invite')
    .post(jwtMiddleware.verifyToken, groupController.sendInvitation)


//Accept invitation endpoint


router
    .route('/:id_group/acceptInvite')
    .post(jwtMiddleware.verifyToken, groupController.acceptInvitation)


// Decline invitation endpoint


router
    .route('/:id_group/declineInvite')
    .post(jwtMiddleware.verifyToken, groupController.declineInvitation)



// Secret Santa assignment endpoint


router
    .route('/:id_group/assign')
    .post(jwtMiddleware.verifyToken, jwtMiddleware.verifyGroupAdmin, groupController.assignSecretSanta)



module.exports = router;

// Swagger API routes
/**
 * @openapi
 * tags:
 *   name: Groups
 *   description: CRUD operations for groups and invitations
 */

/**
 * @openapi
 * /groups:
 *   get:
 *     summary: Get all groups
 *     description: Endpoint to retrieve all groups.
 *     tags: [Groups]
 *     responses:
 *       200:
 *         description: Successful operation
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /groups/create:
 *   post:
 *     summary: Create a group
 *     description: Endpoint to create a new group.
 *     tags: [Groups]
 *     responses:
 *       200:
 *         description: Successful operation
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /groups/{id_group}:
 *   put:
 *     summary: Update a group
 *     description: Endpoint to update an existing group.
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id_group
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *       500:
 *         description: Internal server error
 *   get:
 *     summary: Get a group
 *     description: Endpoint to retrieve a specific group.
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id_group
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete a group
 *     description: Endpoint to delete a specific group.
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id_group
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *       500:
 *         description: Internal server error
 */
