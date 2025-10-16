const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const userValidation = require('../validations/user.validations');
const middleware = require('../middlewares/auth.middleware')

router.post('/register', userValidation.registerValidation, userController.registerUser);
router.post('/login', userValidation.loginValidation, userController.loginUser);
router.get('/profile', middleware.isAuthorized, userController.getUserProfile);
router.put('/update', middleware.isAuthorized, userValidation.updateUserValidation, userController.updateUserById);
router.patch('/update-password', middleware.isAuthorized, userValidation.changePasswordValidation, userController.updateUserPassword)
router.get('/:id', middleware.isAuthorized, userController.getUserById);
router.delete('/:id', middleware.isAuthorized, userValidation.registerValidation, userController.deleteUserById);
router.get('/', middleware.isAuthorized, userValidation.registerValidation, userController.getAllUsers);


module.exports = router;