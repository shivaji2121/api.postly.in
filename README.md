
// Forgot Password
router.post('/forgot-password', userController.forgotPassword);

// Reset Password
router.post('/reset-password/:token', userValidation.resetPasswordValidation, userController.resetPassword);

// Logout
router.post('/logout', middleware.isAuthorized, userController.logoutUser);

// Upload/Update Avatar
router.post('/avatar', middleware.isAuthorized, upload.single('avatar'), userController.uploadAvatar);

// Get User Activity Logs
router.get('/activity', middleware.isAuthorized, userController.getUserActivity);

// Deactivate Account
router.post('/deactivate', middleware.isAuthorized, userController.deactivateAccount);

// Reactivate Account
router.post('/reactivate', middleware.isAuthorized, userController.reactivateAccount);

// Admin: Get All Users
router.get('/admin/users', middleware.isAdmin, userController.adminGetAllUsers);

// Admin: Change User Role
router.put('/admin/users/:id/role', middleware.isAdmin, userController.changeUserRole);
