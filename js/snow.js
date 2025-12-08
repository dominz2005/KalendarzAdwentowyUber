const snowCanvas = document.getElementById("snow");
const ctx = snowCanvas.getContext("2d");

snowCanvas.width = window.innerWidth;
snowCanvas.height = window.innerHeight;

let flakes = [];

for (let i = 0; i < 150; i++) {
  flakes.push({
    x: Math.random() * snowCanvas.width,
    y: Math.random() * snowCanvas.height,
    r: Math.random() * 3 + 1,
    d: Math.random() + 1
  });
}

function draw() {
  ctx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);
  ctx.fillStyle = "white";
  ctx.beginPath();

  for (let f of flakes) {
    ctx.moveTo(f.x, f.y);
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2, true);
  }

  ctx.fill();
  update();
}

function update() {
  for (let f of flakes) {
    f.y += Math.pow(f.d, 2) + 1;

    if (f.y > snowCanvas.height) {
      f.y = -10;
      f.x = Math.random() * snowCanvas.width;
    }
  }
}

function loop() {
  draw();
  requestAnimationFrame(loop);
}

loop();