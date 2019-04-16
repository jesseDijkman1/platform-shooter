"use strict"

const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");

// Game modules
const playerClass = require("./modules/playerClass.js");
const bulletClass = require("./modules/bulletClass.js");

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

  players[socket.id] = new playerClass(socket.id, 20, "blue", 3)

  socket.on("pressed keys", keys => {
    players[socket.id].keypress(keys)
  })

  setInterval(() => {
    for (let player in players) {
      players[player].move()

      socket.emit("update canvas", {
        players: players
      })
    }
  }, 1000/60)

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`)

    delete players[socket.id]
  })
});

server.listen(port, () => console.log(`Listening to port: ${port}`));
