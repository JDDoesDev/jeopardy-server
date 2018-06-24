const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");

const port = process.env.PORT || 4001;
const index = require("./routes/index");
const app = express();

app.use(index);

const server = http.createServer(app);
const io = socketIo(server); // < Interesting!

io.on("connection", socket => {
  console.log("New client connected");

  socket.emit('hello world', 'this is working!');

  socket.on('prepare', (data) => {
    socket.broadcast.emit('prepare', data);
  })
  socket.on('round', (data) => {
    socket.broadcast.emit('round', data);
  })
  socket.on('clues', (data) => {
    socket.broadcast.emit('clues', data);
  })
  socket.on('host', (data) => {
    socket.broadcast.emit('host', data);
  })
  socket.on('view clue', (data) => {
    socket.broadcast.emit('view clue', data);
  })
  socket.on('teams', (data) => {
    console.log(data)
    socket.broadcast.emit('teams', data);
  })

  socket.on("disconnect", () => console.log("Client disconnected"));
});

server.listen(port, () => console.log(`Listening on port ${port}`));
