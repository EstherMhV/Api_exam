const express = require('express');
const router = express.Router();

const jwtMiddleware = require('../middlewares/jwtMiddleware');
const groupController = require('../controllers/groupController');

router
    .route('/')
    .get(jwtMiddleware.verifyToken,groupController.listAllGroups)


// Group creation endpoint
router
    .route('/create')
    .post(groupController.createAGroup)

router
    .route('/:id_group')
    .put(jwtMiddleware.verifyToken,groupController.updateAGroup)
    .get(jwtMiddleware.verifyToken, groupController.getAGroup)
    .delete(jwtMiddleware.verifyToken,groupController.deleteGroup)


/// Group invitation endpoint
// ne pas oublié de se relogin avant d'envoyer l'invitation
// apres avoir creer le groupe afin que le token prenne en compte l'id du group
router
    .route('/invite')
    .post(jwtMiddleware.verifyToken,groupController.sendInvitation)


//Accept invitation endpoint
router
    .route('/:id_group/acceptInvite')
    .post(jwtMiddleware.verifyToken,groupController.acceptInvitation)


// Decline invitation endpoint
router
    .route('/:id_group/declineInvite')
    .post(jwtMiddleware.verifyToken,groupController.declineInvitation)
    


// Secret Santa assignment endpoint
router
    .route('/:id_group/assign')
    .post(jwtMiddleware.verifyToken,groupController.assignSecretSanta)

module.exports = router;
