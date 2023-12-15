const express = require('express');
const router = express.Router();

const jwtMiddleware = require('../middlewares/jwtMiddleware');
const groupController = require('../controllers/groupController');

router
    .route('/')
    .get(groupController.listAllGroups)


// Group creation endpoint
router
    .route('/create')
    .post(groupController.createAGroup)

router
    .route('/:id_group')
    .put(groupController.updateAGroup)
    .delete(groupController.deleteGroup)


/// Group invitation endpoint
router
    .route('/invite')
    .post(groupController.sendInvitation)


//Accept invitation endpoint
router
    .route('/:id_group/acceptInvite')
    .post(groupController.acceptInvitation)


// Decline invitation endpoint
router
    .route('/:id_group/declineInvite')
    .post(groupController.declineInvitation)
    


// Secret Santa assignment endpoint
// router
//     .route('/:id_user/assign')
//     .post(groupController.assignASanta)

module.exports = router;
