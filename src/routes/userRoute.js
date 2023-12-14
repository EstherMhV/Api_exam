const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router
    .route('/register')
    .post(userController.register)


router
    .route('/login')
    .post(userController.login)

router
    .route('/')
    .get(userController.listAllUsers)

router
    .route('/:id_user')
    .put(userController.updateAUser)
    .delete(userController.deleteAUser)
    .get(userController.listAllUsers)

module.exports = router;

