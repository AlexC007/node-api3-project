const express = require('express');

const server = express();
server.use(express.json())
const postRouter = require("./posts/postRouter")
const userRouter = require("./users/userRouter")

server.use(logger)
server.use('/api/posts', postRouter)
server.use('/api/users', userRouter)
server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.get(
      'Origin'
    )}`
  );

  next();
}

module.exports = server;
