const canvas = document.getElementById("mycanvas");
let cal = window.innerWidth - canvas.clientWidth;
let cal1 = window.innerHeight - canvas.clientHeight;
canvas.width = window.innerWidth - cal;
canvas.height = window.innerHeight - cal1;

function Resize() {
  canvas.width = window.innerWidth - cal;
  canvas.height = window.innerHeight - cal1;
  location.reload();
}

window.addEventListener("resize", Resize);
const ctx = canvas.getContext("2d");
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

let isDrawing = false;
let color = "black";
var lw = 1;
var undoStack = [],
  redoStack = [];

canvas.addEventListener("touchstart", start, false);
canvas.addEventListener("touchmove", (e) => draw(e.touches[0]), false);
canvas.addEventListener("touchend", stop, false);

canvas.addEventListener("mousedown", start, false);
canvas.addEventListener("mousemove", draw, false);
canvas.addEventListener("mouseup", stop, false);
canvas.addEventListener("mouseout", stop, false);

//range slider
var slider = document.getElementById("slider");
slider.addEventListener("input", function () {
  ctx.lineWidth = slider.value;
});

function start(e) {
  isDrawing = true;
  ctx.beginPath();
  const x = e.clientX - canvas.offsetLeft;
  const y = e.clientY - canvas.offsetTop;
  ctx.moveTo(x, y);

  const point = {
    x,
    y,
    color: ctx.strokeStyle,
    width: ctx.lineWidth,
    type: "begin",
  };
  undoStack.push(point);
  e.preventDefault();
}

function draw(e) {
  if (isDrawing) {
    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineTo(x, y);
    ctx.strokeStyle = color;
    ctx.stroke();

    const point = {
      x,
      y,
      color: ctx.strokeStyle,
      width: ctx.lineWidth,
      type: "end",
    };

    undoStack.push(point);
  }
}

function stop(e) {
  if (isDrawing) {
    isDrawing = false;
    ctx.closePath();
  }
  e.preventDefault();
}

// Clear Button
var btn_clr = document.querySelector(".clr");
btn_clr.addEventListener("click", function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  undoStack = null;
  redoStack = null;
});

// Eraser button
let store_color = color;
var eraser = document.querySelector(".erase");
eraser.addEventListener("click", erase);
function erase() {
  eraser.classList.toggle("click");
  ctx.lineWidth = "10";
  slider.value = 10;
  store_color = color;
  color = "white";
  if (pens.classList.contains("click")) {
    pens.classList.remove("click");
  }
}

// pencil select
let pens = document.querySelector(".pencil");
pens.addEventListener("click", function () {
  this.classList.toggle("click");
  color = store_color;
  canvas.classList.add("cur");
  console.log(canvas.classList);
  if (eraser.classList.contains("click")) {
    eraser.classList.remove("click");
  }
});

// color buttons
function color_change(e) {
  color = e.style.backgroundColor;
}

let interval;

// Undo
document.querySelector(".undo").addEventListener("mousedown", () => {
  if (undoStack.length > 0) {
    interval = setInterval(() => {
      if (undoStack.length === 0) return;
      // Pop Out the last acrion from undoStack and push it into the redostack
      redoStack.push(undoStack.pop());
      reDraw();
    }, 0);
  }
});

// Undo
document.querySelector(".undo").addEventListener("mouseup", () => {
  clearInterval(interval);
});

// Redo
document.querySelector(".redo").addEventListener("mousedown", () => {
  if (redoStack.length > 0) {
    interval = setInterval(() => {
      if (redoStack.length === 0) return;
      undoStack.push(redoStack.pop());
      reDraw();
    }, 0);
  }
});

document.querySelector(".redo").addEventListener("mouseup", () => {
  clearInterval(interval);
});

function reDraw() {
  if (undoStack.length === 0) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  undoStack.forEach((el) => {
    const point = el;

    ctx.lineWidth = point.width;
    ctx.color = point.color;

    if (point.type === "begin") {
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
    } else if (point.type === "end") {
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }
  });
}

// export button
document.querySelector(".export").addEventListener("click", () => {
  let choice = confirm("Do you Want to Download ?");
  if (choice) {
    const el = document.createElement("a");
    el.href = canvas.toDataURL();
    el.download = "CanvasDrawing.png";
    el.click();
  }
});

document.querySelector(".nxt-btn").addEventListener("click", (e) => {
  document.querySelector(".more-color").classList.toggle("more");
});
