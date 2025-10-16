const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const userValidation = require('../validations/user.validations');
const middleware = require('../middlewares/auth.middleware')

router.post('/register', userValidation.registerValidation, userController.registerUser);
router.post('/login', userValidation.loginValidation, userController.loginUser)
router.get('/profile', middleware.isAuthorized, userController.getUserProfile)
router.get('/:id', middleware.isAuthorized, userController.getUserById)

module.exports = router;