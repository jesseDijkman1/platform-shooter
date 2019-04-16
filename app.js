"use strict"

const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");

const port = 2000;

const app = express();
const server = http.Server(app);
const io = socketIO(server);

const players = {}

app.use(express.static("public"))

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`)
})



io.on("connection", socket => {
  console.log(`${socket.id} connected`)

  players[socket.id] = {}

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`)

    delete players[socket.id]
  })
});

server.listen(port, () => console.log(`Listening to port: ${port}`));
