const express = require('express');
const postRouter = express.Router();
const { getAllPosts, createPost } = require('../db');
const { requireUser } = require('./utils');

postRouter.post('/', requireUser, async (req, res, next) => {
    const { title, content, tags = ""} = req.body;

    const taggArr =tags.trim().split(/\s+/)
    const postData = {title, content, tags};

    if (taggArr.length) {
        postData.tags = taggArr;
    }
    try {
        
        const post = await createPost(postData);
        res.send({ post });

        
    } catch ({name, message}) {
        next({name, message});
    }
});

postRouter.patch('/:postId', requireUser, async (req, res, next) => {
    const { postId } = req.params;
    const { title, content, tags } = req.body;
  
    const updateFields = {};
  
    if (tags && tags.length > 0) {
      updateFields.tags = tags.trim().split(/\s+/);
    }
  
    if (title) {
      updateFields.title = title;
    }
  
    if (content) {
      updateFields.content = content;
    }
  
    try {
      const originalPost = await getPostById(postId);
  
      if (originalPost.author.id === req.user.id) {
        const updatedPost = await updatePost(postId, updateFields);
        res.send({ post: updatedPost })
      } else {
        next({
          name: 'UnauthorizedUserError',
          message: 'You cannot update a post that is not yours'
        })
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  });

  postRouter.delete('/:postId', requireUser, async (req, res, next) => {
    try {
      const post = await getPostById(req.params.postId);
  
      if (post && post.author.id === req.user.id) {
        const updatedPost = await updatePost(post.id, { active: false });
  
        res.send({ post: updatedPost });
      } else {
        // if there was a post, throw UnauthorizedUserError, otherwise throw PostNotFoundError
        next(post ? { 
          name: "UnauthorizedUserError",
          message: "You cannot delete a post which is not yours"
        } : {
          name: "PostNotFoundError",
          message: "That post does not exist"
        });
      }
  
    } catch ({ name, message }) {
      next({ name, message })
    }
  });



postRouter.use((req, res, next) => {
    console.log("A request is being made to /posts");

    next();

});

postRouter.get('/', async (req, res) => {
    const posts = await getAllPosts();

    res.send({
        posts: [posts]
    });
});

module.exports = postRouter;