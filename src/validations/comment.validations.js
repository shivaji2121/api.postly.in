const { body } = require("express-validator")

module.exports.validateComments = [
    body('text')
        .trim()
        .notEmpty().withMessage('Comment is required').bail()
        .isLength({ min: 3 }).withMessage('Comment must be at least 3 characters'),
    body('postId')
        .trim()
        .notEmpty().withMessage('postId is required').bail()
        .isLength({ min: 3 }).withMessage('postId must be at least 16 characters')
]

module.exports.validateUpdateComments = [
    body('text')
        .optional()
        .trim()
        .notEmpty().withMessage('Comment is required').bail()
        .isLength({ min: 3 }).withMessage('Comment must be at least 3 characters'),
]