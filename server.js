const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const cors = require("cors");

const port = process.env.PORT || 4001;
const index = require("./routes/index");
const app = express();


app.use(cors());
app.use(index);

const server = http.createServer(app);
const io = socketIo(server); // < Interesting!

io.origins(['jeopardy.dorfs.website']);

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
