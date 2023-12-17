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
    .get(jwtMiddleware.verifyToken,userController.listAllUsers)

router
    .route('/:id_user')
    .put(jwtMiddleware.verifyToken,userController.updateAUser)
    .delete(jwtMiddleware.verifyToken,userController.deleteAUser)
    .get(jwtMiddleware.verifyToken,userController.listAllUsers)
    .get(jwtMiddleware.verifyToken, userController.getAUser)

module.exports = router;

