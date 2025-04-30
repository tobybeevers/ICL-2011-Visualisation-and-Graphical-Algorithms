let data;
let xMin, xMax, yMin, yMax;
let points = []; // Store point positions for hover detection

function preload() {
  data = loadTable('scatterdata.csv', 'csv', 'header', () => {
    console.log("Data Loaded:", data.getRowCount(), "rows");
  });
}

function setup() {
  let container = document.getElementById("visualization1");
  let canvas = createCanvas(container.clientWidth, container.clientHeight);
  canvas.parent("visualization1");
  background(255);

  if (data.getRowCount() > 0) {
    prepareData();
  } else {
    console.error("No data loaded");
  }
}

function prepareData() {
  let xVals = data.getColumn(0).map(Number);
  let yVals = data.getColumn(1).map(Number);

  xMin = min(xVals);
  xMax = max(xVals);
  yMin = min(yVals);
  yMax = max(yVals);

  let padding = 50;
  points = [];

  for (let i = 0; i < data.getRowCount(); i++) {
    let x = map(data.getNum(i, 0), xMin, xMax, padding, width - padding);
    let y = map(data.getNum(i, 1), yMin, yMax, height - padding, padding);
    points.push({ x, y });
  }
}

function draw() {
  background(255);

  let padding = 50;
  
  // Draw axes
  stroke(0);
  line(padding, height - padding, width - padding, height - padding); // X-axis
  line(padding, height - padding, padding, padding); // Y-axis

  // Labels
  textSize(12);
  textAlign(CENTER, CENTER);
  text('X Axis', width / 2, height - 20);
  text('Y Axis', 20, height / 2);

  // Plot points with hover effect
  for (let i = 0; i < points.length; i++) {
    let { x, y } = points[i];

    // Check if mouse is near a point
    if (dist(mouseX, mouseY, x, y) < 8) {
      fill(255, 0, 0); // Highlight red
    } else {
      fill(0); // Default black
    }

    noStroke();
    ellipse(x, y, 10, 10);
  }
}

function windowResized() {
  let container = document.getElementById("visualization1");
  resizeCanvas(container.clientWidth, container.clientHeight);
  prepareData();
}
