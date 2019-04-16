module.exports = class Bullet {
  constructor(data) {
    this.id = data.id;
    this.speed = 5;
    this.size = 10;
    this.xSpeed;
    this.ySpeed;
    this.angle;
    this.cWidth = data.cw;
    this.cHeight = data.ch;
    this.x = data.px;
    this.y = data.py;
    this.xStart = data.px;
    this.yStart = data.py;
    this.mouseX = data.mx;
    this.mouseY = data.my;
    this.xDistance = this.mouseX - this.xStart;
    this.yDistance = this.mouseY - this.yStart;

    this.direction()
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

  checkPos() {
    if (this.y + this.size < 0) {
      return true;
    } else if (this.y - this.size > this.cHeight) {
      return true;
    }

    if (this.x + this.size < 0) {
      return true;
    } else if (this.x - this.size > this.cWidth) {
      return true;
    }
  }


  direction() {
    // Source: https://stackoverflow.com/questions/17009252/html5-game-canvas-calculate-speed-and-direction-for-bullet-using-last-velx-and

    this.angle = Math.atan(Math.abs(this.yDistance / this.xDistance))
    this.xSpeed = this.speed * Math.cos(this.angle)
    this.ySpeed = this.speed * Math.sin(this.angle)
  }
}
