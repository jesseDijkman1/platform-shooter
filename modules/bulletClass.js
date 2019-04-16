module.exports = class Bullet {
  constructor(xStart, yStart, mouseX, mouseY) {
    this.speed = 10;
    this.size = 10;
    this.xSpeed;
    this.ySpeed;
    this.x = xStart;
    this.y = yStart;
    this.xStart = xStart;
    this.yStart = yStart;
    this.mouseX = mouseX;
    this.mouseY = mouseY;
    this.xDistance = this.mouseX - this.xStart;
    this.yDistance = this.mouseY - this.yStart;

    this.angle = this.direction()
  }

  draw() {
    this.move()

    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fillStyle = "black";
    ctx.fill()
  }

  move() {
    if (this.mouseX < this.xStart) {
      this.x -= this.xSpeed
    } else {
      this.x += this.xSpeed
    }

    if (this.mouseY < this.yStart) {
      this.y -= this.ySpeed
    } else {
      this.y += this.ySpeed
    }
  }

  checkPos(index) {
    if (this.y + this.size < 0 || this.y - this.size > cHeight) {
      bullets.splice(this.index, 1)
    }

    if (this.x + this.size < 0 || this.x - this.size > cWidth) {
      bullets.splice(this.index, 1)
    }

    console.log(bullets)
  }

  direction() {
    // Source: https://stackoverflow.com/questions/17009252/html5-game-canvas-calculate-speed-and-direction-for-bullet-using-last-velx-and
    this.angle = Math.atan(Math.abs(this.yDistance / this.xDistance))
    this.xSpeed = this.speed * Math.cos(this.angle)
    this.ySpeed = this.speed * Math.sin(this.angle)
  }
}
