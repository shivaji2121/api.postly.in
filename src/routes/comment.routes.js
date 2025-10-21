const express = require('express');
const commentsRouter = express.Router();
const middleware = require('../middlewares/auth.middleware');
const commentController = require('../controllers/comment.controller');
const commentValidations = require('../validations/comment.validations')

commentsRouter.post('/save', middleware.isAuthorized, commentValidations.validateComments, commentController.createComment)
commentsRouter.get('/:id', middleware.isAuthorized, commentController.getCommentById);
commentsRouter.put('/update/:id', middleware.isAuthorized, commentValidations.validateUpdateComments, commentController.updateCommentById);
commentsRouter.delete('/:id', middleware.isAuthorized, commentController.softDeleteCommentById);
commentsRouter.get('/', middleware.isAuthorized, commentController.getAllComments);

module.exports = commentsRouter;