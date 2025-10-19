const express = require('express');
const commentsRouter = express.Router();
const middleware = require('../middlewares/auth.middleware');
const commentController = require('../controllers/comment.controller');

commentsRouter.post('/', middleware.isAuthorized, commentController.createComment)

module.exports = commentsRouter;