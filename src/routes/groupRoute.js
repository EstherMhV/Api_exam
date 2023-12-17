const express = require('express');
const router = express.Router();

const jwtMiddleware = require('../middlewares/jwtMiddleware');
const groupController = require('../controllers/groupController');


router
    .route('/')
    .get(jwtMiddleware.verifyToken, groupController.listAllGroups)


// Group creation endpoint
/**
 * @swagger
 * /groups/create:
 *   post:
 *     summary: Create a new group
 *     responses:
 *       200:
 *         description: The created group.
 */
router
    .route('/create')
    .post(groupController.createAGroup)



router
    .route('/:id_group')
    .put(jwtMiddleware.verifyToken, jwtMiddleware.verifyAdminOrGroupAdmin, groupController.updateAGroup)
    .get(jwtMiddleware.verifyToken, jwtMiddleware.verifyAdminOrGroupAdmin, groupController.getAGroup)
    .delete(jwtMiddleware.verifyToken, jwtMiddleware.verifyAdminOrGroupAdmin, groupController.deleteGroup)


/// Group invitation endpoint
// ne pas oublié de se relogin avant d'envoyer l'invitation
// apres avoir creer le groupe afin que le token prenne en compte l'id du group


router
    .route('/invite')
    .post(jwtMiddleware.verifyToken, groupController.sendInvitation)


//Accept invitation endpoint

/**
 * @swagger
 * /groups/:id_group/acceptInvite:
 *   post:
 *     summary: User accept the invitation to the group
 *     responses:
 *       200:
 *         description: User accept the invitation to the group.
 */
router
    .route('/:id_group/acceptInvite')
    .post(jwtMiddleware.verifyToken, groupController.acceptInvitation)


// Decline invitation endpoint

/**
 * @swagger
 * /groups/:id_group/declineInvite:
 *   post:
 *     summary: User decline the invitation to the group
 *     responses:
 *       200:
 *         description:User decline the invitation to the group.
 */
router
    .route('/:id_group/declineInvite')
    .post(jwtMiddleware.verifyToken, groupController.declineInvitation)



// Secret Santa assignment endpoint

/**
 * @swagger
 * /groups/:id_group/assign:
 *   post:
 *     summary: Admin of the group assign secret santa to each members of the group
 *     responses:
 *       200:
 *         description: Admin of the group assign secret santa to each members of the group
 */
router
    .route('/:id_group/assign')
    .post(jwtMiddleware.verifyToken, jwtMiddleware.verifyGroupAdmin, groupController.assignSecretSanta)

module.exports = router;
