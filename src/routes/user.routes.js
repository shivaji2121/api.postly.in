const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const userValidation = require('../validations/user.validations');
const middleware = require('../middlewares/auth.middleware');
const upload = require('../config/file.upload.configuration');


router.post('/register', userValidation.registerValidation, userController.registerUser);
router.post('/login', userValidation.loginValidation, userController.loginUser);
router.get('/profile', middleware.isAuthorized, userController.getUserProfile);
router.put('/update', middleware.isAuthorized, userValidation.updateUserValidation, userController.updateUserById);
router.patch('/update-password', middleware.isAuthorized, userValidation.changePasswordValidation, userController.updateUserPassword);

router.post('/upload', middleware.isAuthorized, upload.single('profilePicture'), userController.uploadProfile);
router.delete('/delete-profile', middleware.isAuthorized, userController.deleteProfile);

router.get('/:id', middleware.isAuthorized, userController.getUserById);
router.delete('/:id', middleware.isAuthorized, userValidation.registerValidation, userController.deleteUserById);
router.get('/', middleware.isAuthorized, userValidation.registerValidation, userController.getAllUsers);




module.exports = router;