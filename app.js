const c = document.getElementById("Bounce");
const canvasHeight = c.height;
const canvasWidth = c.width;
const ctx = c.getContext("2d");
let circle_x = 160;
let circle_y = 60;
let radius = 20;
let xSpeed = 20;
let ySpeed = 20;
let ground_x = 100;
let ground_y = 500;
let ground_height = 5;
let brickArray = [];
let bricks = [];
let count = 0;

function getRandomArbitrary(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

function generateUniqueBrick() {
  let x = getRandomArbitrary(0, 950);
  let y = getRandomArbitrary(0, 550);

  if (!brickArray.includes([x, y])) {
    brickArray.push([x, y]);
    let newbrick = new Brick(x, y);
    bricks.push(newbrick);
  } else {
    generateUniqueBrick();
  }
}

class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    brickArray.push(this);
    this.visible = true;
  }

  drawBrick() {
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  touchingBall(ballX, ballY) {
    return (
      ballX >= this.x - radius &&
      ballX <= this.x + this.width + radius &&
      ballY <= this.y + this.height + radius &&
      ballY >= this.y - radius
    );
  }
}
//製作所有的brick
for (let i = 0; i < 10; i++) {
  generateUniqueBrick();
}

c.addEventListener("mousemove", (e) => {
  ground_x = e.clientX;
});

function drawCircle() {
  //確認球是否打到磚塊
  brickArray.forEach((brick) => {
    if (brick.visible && brick.touchingBall(circle_x, circle_y)) {
      count++;
      brick.visible = false;
      if (circle_y >= brick.y + brick.height || circle_y <= brick.y) {
        ySpeed *= -1;
      } else if (circle_x >= brick.x + brick.width || circle_x <= brick.x) {
        //從右左方撞擊
        xSpeed *= -1;
      }
      if (count == 10) {
        alert("遊戲結束");
        clearInterval(game);
      }
    }
  });

  //確認球是否打到橘色地板
  if (
    circle_x >= ground_x - radius &&
    circle_x <= ground_x + 200 + radius &&
    circle_y >= ground_y - radius &&
    circle_y <= ground_y + radius
  ) {
    if (ySpeed > 0) {
      circle_y -= 40;
    } else {
      circle_y += 40;
    }
    ySpeed *= -1;
  }
  if (circle_x >= canvasWidth - radius) {
    xSpeed *= -1;
  }

  if (circle_x <= radius) {
    xSpeed *= -1;
  }

  if (circle_y <= radius) {
    ySpeed *= -1;
  }

  if (circle_y >= canvasHeight - radius) {
    ySpeed *= -1;
  }

  // 更動圓的座標
  circle_x += xSpeed;
  circle_y += ySpeed;

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  //畫出所有的brick
  brickArray.forEach((brick) => {
    if (brick.visible) {
      brick.drawBrick();
    }
  });

  //畫出可控制球的地板
  ctx.fillStyle = "orange";
  ctx.fillRect(ground_x, ground_y, 200, ground_height);

  //畫出圓球
  ctx.beginPath();
  ctx.arc(circle_x, circle_y, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = "yellow";
  ctx.fill();
}

let game = setInterval(drawCircle, 25);
