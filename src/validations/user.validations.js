const { body } = require('express-validator');

const registerValidation = [
    body('username')
        .trim()
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),
    body('phone')
        .trim()
        .notEmpty().withMessage('Phone number is required')
        .matches(/^\d{10}$/).withMessage('Phone number must be exactly 10 digits'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one number')
        .matches(/[@$!%*?&#]/).withMessage('Password must contain at least one special character'),
    body('bio')
        .optional()
        .isLength({ max: 100 }).withMessage('Bio cannot exceed 100 characters')
];

const updateUserValidation = [
    body('username')
        .trim()
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),
    body('phone')
        .trim()
        .notEmpty().withMessage('Phone number is required')
        .matches(/^\d{10}$/).withMessage('Phone number must be exactly 10 digits'),
    body('bio')
        .optional()
        .isLength({ max: 100 }).withMessage('Bio cannot exceed 100 characters')
];

const loginValidation = [
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
]

const changePasswordValidation = [
    body('oldPassword')
        .notEmpty().withMessage('Old password is required').bail()
        .isLength({ min: 8 }).withMessage('Old password must be at least 8 characters'),

    body('newPassword')
        .notEmpty().withMessage('New password is required').bail()
        .isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
];


module.exports = { registerValidation, updateUserValidation, loginValidation, changePasswordValidation };
