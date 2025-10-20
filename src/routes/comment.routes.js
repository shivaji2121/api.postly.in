const express = require('express');
const commentsRouter = express.Router();
const middleware = require('../middlewares/auth.middleware');
const commentController = require('../controllers/comment.controller');
const commentValidations = require('../validations/comment.validations')

commentsRouter.post('/save', middleware.isAuthorized, commentValidations.validateComments, commentController.createComment)

module.exports = commentsRouter;