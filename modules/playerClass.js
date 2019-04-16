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
    if (this.keys[37] || this.keys[65]) {
      // Left
      if (this.x - this.size > 0) {
        this.x -= this.speed
      }
    }

    if (this.keys[38] || this.keys[87]) {
      // Up
      if (this.y - this.size > 0) {
        this.y -= this.speed
      }
    }

    if (this.keys[39] || this.keys[68]) {
      // Right
      if (this.x + this.size < this.canvas.width) {
        this.x += this.speed
      }

    }

    if (this.keys[40] || this.keys[83]) {
      // Down
      if (this.y + this.size < this.canvas.height) {
        this.y += this.speed
      }
    }
  }

  checkHit(bullets) {
    bullets.forEach((b, i) => {
      const xDist = Math.abs(b.x - this.x);
      const yDist = Math.abs(b.y - this.y);
      const distance = Math.sqrt((xDist * xDist) + (yDist * yDist)) - (b.size + this.size);

      if (distance <= 0 && b.id != this.id) {
        b.move()
        bullets.splice(i, 1);
      }
    })

    // console.log(bullets)
  }

  shoot(e) {
    const mouseX = e.pageX - e.currentTarget.offsetLeft;
    const mouseY = e.pageY - e.currentTarget.offsetTop;

    bullets.push(new Bullet(this.x, this.y, mouseX, mouseY));
  }
}
