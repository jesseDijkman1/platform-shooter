"use strict"

////////////////////////////
// ==== Node Modules ==== //
////////////////////////////

const express = require("express"),
      http = require("http"),
      socketIO = require("socket.io"),
      path = require("path");

////////////////////////////
// ==== Game Classes ==== //
////////////////////////////

const playerClass = require("./classes/playerClass.js"),
      bulletClass = require("./classes/bulletClass.js");

/////////////////////////
// ==== Constants ==== //
/////////////////////////

const availableColors = ["blue", "green", "yellow", "orange"],
      port = 2000;

///////////////////////////////
// ==== Data Containers ==== //
///////////////////////////////

const players = {},
      bullets = [];


//////////////////////////
// ==== Middleware ==== //
//////////////////////////

const app = express(),
      server = http.Server(app),
      io = socketIO(server);

app.use(express.static("public"))

///////////////////////
// ==== Routing ==== //
///////////////////////

app.get("/", (req, res) => res.sendFile(`${__dirname}/public/index.html`));

/////////////////////////
// ==== Socket.io ==== //
/////////////////////////

io.on("connection", socket => {
  console.log(`${socket.id} connected`)

  socket.on("init", canvasData => {

    // Create a new instance of a player
    players[socket.id] = new playerClass({
      id: socket.id,
      size: 20,
      color: availableColors[Object.keys(players).length],
      speed: 3,
      cWidth: canvasData.cWidth,
      cHeight: canvasData.cHeight
    })

    // Any key is pressed
    socket.on("pressed keys", keys => players[socket.id].keypress(keys))

    // A user clicks
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
    })

    setInterval(() => {
      for (let player in players) {
        // Update the players positions
        players[player].move()

        // Check if the hypothenuse is 0 between any ball and any player
        players[player].checkHit(bullets)
      }

      bullets.forEach((b, i) => {
        // Update the bullets their positions
        b.move()

        // If the bullets are outside the canvas, remove them
        if (b.checkPos()) {
          console.log("removed")
          bullets.splice(i, 1)
        }
      })

      // Send all data for the client to render
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
