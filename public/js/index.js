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
      })
  })
}

events()

socket.on("update canvas", data => {
  ctx.clearRect(0, 0, cWidth, cHeight);

  for (let player in data.players) {
    const playerData = data.players[player]

    ctx.beginPath()
    ctx.arc(playerData.x, playerData.y, playerData.size, 0, 2 * Math.PI);
    ctx.fillStyle = playerData.color;
    ctx.fill()

    playerData.bullets.forEach(b => {
      ctx.beginPath()
      ctx.arc(b.x, b.y, b.size, 0, 2 * Math.PI);
      ctx.fillStyle = "black";
      ctx.fill()
    })
  }



  // for (let bullet in data.bullets) {
  //
  // }
  // const players = data.players;


})


// class Events {
//   constructor(el) {
//     this.el = el;
//     this.pressedKeys = {};
//     this.presses = [];
//
//     this.keypress.bind(this);
//     this.click.bind(this);
//   }
//
//   keypress(callback) {
//     window.addEventListener("keyup", e => {
//       delete this.pressedKeys[e.keyCode];
//
//       this.presses.find((k, i) => {
//         if (k == e.keyCode) {
//           this.presses.splice(i, 1);
//         }
//       })
//
//       return socket.emit("pressed keys", this.pressedKeys);
//     })
//
//     window.addEventListener("keydown", e => {
//       if (this.presses.includes(e.keyCode)) {
//         return;
//       }
//
//       this.presses.push(e.keyCode);
//       this.pressedKeys[e.keyCode] = true;
//
//       return socket.emit("pressed keys", this.pressedKeys);
//     })
//   }
//
//   click(callback) {
//     this.el.addEventListener("click", e => {
//       return callback(e);
//     })
//   }
// }
//
// new Events(canvas)

// class Bullet {
//   constructor(xStart, yStart, mouseX, mouseY) {
//     this.speed = 10;
//     this.size = 10;
//     this.xSpeed;
//     this.ySpeed;
//     this.x = xStart;
//     this.y = yStart;
//     this.xStart = xStart;
//     this.yStart = yStart;
//     this.mouseX = mouseX;
//     this.mouseY = mouseY;
//     this.xDistance = this.mouseX - this.xStart;
//     this.yDistance = this.mouseY - this.yStart;
//
//     this.angle = this.direction()
//   }
//
//   draw() {
//     this.move()
//
//     ctx.beginPath()
//     ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
//     ctx.fillStyle = "black";
//     ctx.fill()
//   }
//
//   move() {
//     if (this.mouseX < this.xStart) {
//       this.x -= this.xSpeed
//     } else {
//       this.x += this.xSpeed
//     }
//
//     if (this.mouseY < this.yStart) {
//       this.y -= this.ySpeed
//     } else {
//       this.y += this.ySpeed
//     }
//   }
//
//   checkPos(index) {
//     if (this.y + this.size < 0 || this.y - this.size > cHeight) {
//       bullets.splice(this.index, 1)
//     }
//
//     if (this.x + this.size < 0 || this.x - this.size > cWidth) {
//       bullets.splice(this.index, 1)
//     }
//
//     console.log(bullets)
//   }
//
//   direction() {
//     // Source: https://stackoverflow.com/questions/17009252/html5-game-canvas-calculate-speed-and-direction-for-bullet-using-last-velx-and
//     this.angle = Math.atan(Math.abs(this.yDistance / this.xDistance))
//     this.xSpeed = this.speed * Math.cos(this.angle)
//     this.ySpeed = this.speed * Math.sin(this.angle)
//   }
// }
//
// class Player {
//   constructor(size, color, speed, events) {
//     this.size = size;
//     this.color = color;
//     this.speed = speed;
//     this.events = events;
//     this.x = 250;
//     this.y = 250;
//     this.keys = {};
//
//     this.events.keypress(keys => this.keys = keys)
//
//     this.events.click(this.shoot.bind(this))
//   }
//
//   draw() {
//     this.move()
//
//     ctx.beginPath()
//     ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
//     ctx.fillStyle = this.color;
//     ctx.fill()
//   }
//
//   move() {
//
//
//     if (this.keys[37] || this.keys[65]) {
//       // Left
//       this.x -= this.speed
//     }
//
//     if (this.keys[38] || this.keys[87]) {
//       // Up
//       this.y -= this.speed
//     }
//
//     if (this.keys[39] || this.keys[68]) {
//       // Right
//       this.x += this.speed
//     }
//
//     if (this.keys[40] || this.keys[83]) {
//       // Down
//       this.y += this.speed
//     }
//   }
//
//   shoot(e) {
//     const mouseX = e.pageX - e.currentTarget.offsetLeft;
//     const mouseY = e.pageY - e.currentTarget.offsetTop;
//
//     bullets.push(new Bullet(this.x, this.y, mouseX, mouseY));
//   }
// }
//
// const ev = new Events(canvas)
// // const player = new Player(20, "red", 3, ev);
//
// // ev.click(e => console.log(e.target))
// // ev.keypress(keys => console.log(keys))
//
//
//
// players.push(new Player(20, "blue", 3, ev))
//
// function draw() {
//   ctx.clearRect(0,0,cWidth, cHeight)
//   players.forEach(p => p.draw())
//   bullets.forEach(b => b.draw())
//   bullets.forEach((b, i) => b.checkPos(i))
// }
//
// setInterval(draw, 1000/60)
//
// // draw()
