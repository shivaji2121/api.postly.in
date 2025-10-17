
const { body } = require('express-validator');

module.exports.validateCreatePost = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required').bail()
        .isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
    body('content')
        .trim()
        .notEmpty().withMessage('Content is required').bail()
        .isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
    body('image')
        .optional()
        .isURL().withMessage('Image must be a valid URL')
];