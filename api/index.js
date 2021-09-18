const express = require('express');
const apiRouter = express.Router();
const userRouter = require('./users');
const postRouter = require('./posts');
const tagsRouter = require('./tags');

apiRouter.use('/users', userRouter);
apiRouter.use('/posts', postRouter);
apiRouter.use('/tags', postRouter);

module.exports = apiRouter;