module.exports = class Player {
  constructor(id, size, color, speed) {
    this.id = id
    this.size = size;
    this.color = color;
    this.speed = speed;
    this.x = 250;
    this.y = 250;
    this.keys = {};

  }

  keypress(keys) {
    this.keys = keys
  }

  // update() {
  //   this.move()
  // }

  move() {


    if (this.keys[37] || this.keys[65]) {
      // Left
      this.x -= this.speed
    }

    if (this.keys[38] || this.keys[87]) {
      // Up
      this.y -= this.speed
    }

    if (this.keys[39] || this.keys[68]) {
      // Right
      this.x += this.speed
    }

    if (this.keys[40] || this.keys[83]) {
      // Down
      this.y += this.speed
    }
  }

  shoot(e) {
    const mouseX = e.pageX - e.currentTarget.offsetLeft;
    const mouseY = e.pageY - e.currentTarget.offsetTop;

    bullets.push(new Bullet(this.x, this.y, mouseX, mouseY));
  }
}
