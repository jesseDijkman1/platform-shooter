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
const bullets = [];

app.use(express.static("public"))

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`)
})



io.on("connection", socket => {
  console.log(`${socket.id} connected`)

  socket.on("init", canvasData => {
    players[socket.id] = new playerClass(socket.id, 20, "blue", 3, canvasData.cWidth, canvasData.cHeight)

    socket.on("pressed keys", keys => {
      players[socket.id].keypress(keys)
    })

    socket.on("shot fired", data => {
      bullets.push(new bulletClass({
        id: socket.id,
        px: players[socket.id].x,
        py: players[socket.id].y,
        mx: data.mouseX,
        my: data.mouseY,
        cw: data.cWidth,
        ch: data.cHeight
      }))
      // bullets.push(new bulletClass(socket.id, players[socket.id].x, players[socket.id].y, data.mouseX, data.mouseY))
      // for (let player in players) {
        // players[player].bullets.push(new bulletClass(players[socket.id].x, players[socket.id].y, data.mouseX, data.mouseY))
        // if (player == socket.id) {
        //
        // } else {
        //   players[player].enemyBullets.push(
        //     new bulletClass(
        //       players[socket.id].x,
        //       players[socket.id].y,
        //       data.mouseX,
        //       data.mouseY
        //     ))
        // }
      // }
    })

    setInterval(() => {

      for (let player in players) {
        players[player].move()
      }
      bullets.forEach(bullet => {
        bullet.move()
      })
      // for (let bullet in bullets) {
      //   bullets[bullet].move()
      // }
      io.emit("update canvas", {
        players: players,
        bullets: bullets
      })

    }, 1000/60)
  })
  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`)

    delete players[socket.id]
  })
});

server.listen(port, () => console.log(`Listening to port: ${port}`));
