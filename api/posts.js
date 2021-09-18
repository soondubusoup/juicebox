// const express = require('express');
// const userRouter = express.Router();
// const { getAllUsers } = require('../db');

// userRouter.use((req, res, next) => {
//     console.log("A request is being made to /users");

//     next();

// });

// userRouter.get('/', async (req, res) => {
//     const users = await getAllUsers();
//     console.log(users)
    
//     res.send({
//         users: [users]
//     });
// });



// module.exports = userRouter;

const express = require('express');
const postRouter = express.Router();
const { getAllPosts } = require('../db');

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