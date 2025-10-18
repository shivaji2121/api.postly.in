const express = require('express');
const postRouter = express.Router();
const postController = require('../controllers/post.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const postValidations = require('../validations/posts.validations');


postRouter.post('/create', authMiddleware.isAuthorized, postValidations.validateCreatePost, postController.createPost)
postRouter.get('/:id', authMiddleware.isAuthorized, postController.getPostById);
postRouter.put('/:id', authMiddleware.isAuthorized, postValidations.validateCreatePost, postController.updatePost);
postRouter.post('/:id/like', authMiddleware.isAuthorized, postController.likePost);
postRouter.post('/:id/un-like', authMiddleware.isAuthorized, postController.unLikePost);
postRouter.delete('/:id', authMiddleware.isAuthorized, postController.deletePost);
postRouter.get('/', authMiddleware.isAuthorized, postController.getAllPosts);



module.exports = postRouter;

