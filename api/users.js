const express = require("express");
const userRouter = express.Router();
const { getAllUsers, getUserByUsername } = require("../db");
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = process.env


userRouter.use((req, res, next) => {
  console.log("A request is being made to /users");

  next();
});

userRouter.get("/", async (req, res) => {
  const users = await getAllUsers();
  console.log(users);

  res.send({
    users: [users],
  });
});

userRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  // request must have both
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }

  try {
    const user = await getUserByUsername(username);
    const token = jwt.sign(user, JWT_SECRET);

    if (user && user.password === password) {
      res.send({ message: "you're logged in!", token: token });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = userRouter;
