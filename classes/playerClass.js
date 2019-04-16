module.exports = class Player {
  constructor(data) {
    this.id = data.id
    this.size = data.size;
    this.color = data.color;
    this.speed = data.speed;
    this.health = 100;
    this.canvas = {
      width: data.cWidth,
      height: data.cHeight
    }
    this.x = 250;
    this.y = 250;
    this.keys = {};
    this.bullets = [];
    this.enemyBullets = [];
  }

  keypress(keys) {
    this.keys = keys
  }

  move() {
    // Left
    if (this.keys[37] || this.keys[65]) {
      if (this.x - this.size > 0) {
        this.x -= this.speed
      }
    }

    // Up
    if (this.keys[38] || this.keys[87]) {
      if (this.y - this.size > 0) {
        this.y -= this.speed
      }
    }

    // Right
    if (this.keys[39] || this.keys[68]) {
      if (this.x + this.size < this.canvas.width) {
        this.x += this.speed
      }
    }

    // Down
    if (this.keys[40] || this.keys[83]) {
      if (this.y + this.size < this.canvas.height) {
        this.y += this.speed
      }
    }
  }

  checkHit(bullets) {
    bullets.forEach((b, i) => {
      const xDist = Math.abs(b.x - this.x),
            yDist = Math.abs(b.y - this.y),
            distance = Math.sqrt((xDist * xDist) + (yDist * yDist)) - (b.size + this.size);

      if (distance <= 0 && b.id != this.id) {
        b.move()
        bullets.splice(i, 1);
      }
    })
  }

  shoot(e) {
    const mouseX = e.pageX - e.currentTarget.offsetLeft,
          mouseY = e.pageY - e.currentTarget.offsetTop;

    bullets.push(new Bullet(this.x, this.y, mouseX, mouseY));
  }
}
