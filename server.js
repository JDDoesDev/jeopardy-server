const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");

const port = process.env.PORT || 4001;
const index = require("./routes/index");
const app = express();


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(index);

const server = http.createServer(app);
const io = socketIo(server); // < Interesting!

io.origins((origin, callback) => {
  if (origin !== 'https://jeopardy.dorfs.website') {
    return callback('origin not allowed', false);
  }
  callback(null, true);
});

io.on("connection", socket => {
  let room;

  console.log("New client connected");

  socket.emit('hello world', 'this is working!');

  socket.on('prepare', (data) => {
    socket.broadcast.to(room).emit('prepare', data);
  })
  socket.on('round', (data) => {
    socket.broadcast.to(room).emit('round', data);
  })
  socket.on('clues', (data) => {
    socket.broadcast.to(room).emit('clues', data);
  })
  socket.on('host', (data) => {
    socket.broadcast.to(room).emit('host', data);
  })
  socket.on('view clue', (data) => {
    socket.broadcast.to(room).emit('view clue', data);
  })
  socket.on('teams', (data) => {
    socket.broadcast.to(room).emit('teams', data);
  })
  socket.on('room', (data) => {
    socket.join(data);
    room = data;
  })


  socket.on("disconnect", () => console.log("Client disconnected"));
});

server.listen(port, () => console.log(`Listening on port ${port}`));
