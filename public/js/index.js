"use strict";

const socket = io();

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
let cWidth;
let cHeight;

// Set the canvas width and height to it's css width and height
(() => {
  cWidth = canvas.offsetWidth;
  cHeight = canvas.offsetHeight;

  canvas.setAttribute("width", cWidth);
  canvas.setAttribute("height", cHeight);

  socket.emit("init", {cWidth: cWidth, cHeight: cHeight})
})()

// updateCanvas()

function events() {
  const pressedKeys = {};
  const presses = [];

  window.addEventListener("keyup", e => {
    delete pressedKeys[e.keyCode];

    presses.find((k, i) => {
      if (k == e.keyCode) {
        presses.splice(i, 1);
      }
    })

    return socket.emit("pressed keys", pressedKeys);
  })

  window.addEventListener("keydown", e => {
    if (presses.includes(e.keyCode)) {
      return;
    }

    presses.push(e.keyCode);
    pressedKeys[e.keyCode] = true;

    return socket.emit("pressed keys", pressedKeys);
  })

  canvas.addEventListener("click", e => {
    socket.emit("shot fired", {
        mouseX: e.pageX - e.currentTarget.offsetLeft,
        mouseY: e.pageY - e.currentTarget.offsetTop,
        cWidth: cWidth,
        cHeight: cHeight
      })
  })
}

events()

socket.on("update canvas", data => {
  ctx.clearRect(0, 0, cWidth, cHeight);

  data.bullets.forEach(b => {
    ctx.beginPath()
    ctx.arc(b.x, b.y, b.size, 0, 2 * Math.PI);
    ctx.fillStyle = "black";
    ctx.fill()
  })

  for (let player in data.players) {
    const playerData = data.players[player]

    ctx.beginPath()
    ctx.arc(playerData.x, playerData.y, playerData.size, 0, 2 * Math.PI);
    ctx.fillStyle = playerData.color;
    ctx.fill()

    }
  })
