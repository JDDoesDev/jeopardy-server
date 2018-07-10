const express = require("express");
const http = require("http");
const https = require("https");
const socketIo = require("socket.io");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs");

const port = process.env.PORT || 4001;
const sslPort = 4001;
const index = require("./routes/index");
const app = express();

const server = http.createServer(app);
const io = socketIo(server); // < Interesting!

app.use(cors());
app.use(index);

io.origins("*:*");

io.on("connection", socket => {
  let room;
  let teams = {};

  console.log("New client connected");

  socket.emit('hello world', 'this is working!');

  socket.on('room', (data, fn) => {
    socket.join(data);
    fn(true);
    room = data;
  })
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
    io.in(room).emit('teams', data);
  })
  socket.on('team getter', (data) => {
    socket.broadcast.to(room).emit('team getter', data);
  })
  socket.on('show daily', (data) => {
    socket.broadcast.to(room).emit('show daily', data);
  })
  socket.on('firsties', (data) => {
    console.log('firsties')
    socket.broadcast.to(room).emit('firsties', data);
  })
  socket.on('buzzer', (data) => {
    socket.broadcast.to(room).emit('buzzer', data);
  })
  socket.on('answered', (data) => {
    console.log('answered');
    console.log(data);
    socket.broadcast.to(room).emit('answered', data);
  })
  socket.on('final jeopardy', (data) => {
    socket.broadcast.to(room).emit('final jeopardy', data);
  })
  socket.on('final answer', (data) => {
    console.log(data);
    socket.broadcast.to(room).emit('final answer', data);
  })
  socket.on('final wager reveal', (data) => {
    console.log(data);
    socket.broadcast.to(room).emit('final wager reveal', data);
  })
  socket.on('final wager', (data) => {
    console.log(data);
    socket.broadcast.to(room).emit('final wager', data);
  })

  socket.on("disconnect", () => console.log("Client disconnected"));
});

server.listen(port, () => console.log(`Listening on port ${port}`));
