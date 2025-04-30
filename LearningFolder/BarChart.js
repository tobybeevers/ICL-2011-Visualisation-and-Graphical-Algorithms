let table;
let margins = 40;
let availableHeight;
let colors = [];  // Array to store bar colors

function preload() {
    table = loadTable("data.csv", "csv", "header");
}

function setup() {
    createCanvas(600, 400);
    background(240);

    let rowCount = table.getRowCount();
    let barWidth = (width - margins * 2) / rowCount;

    let values = table.getColumn("Value").map(Number);
    let maxValue = max(values);
    availableHeight = height - margins * 2;

    // Generate random colors for each bar
    for (let i = 0; i < rowCount; i++) {
        colors.push(color(random(50, 200), random(100, 250), random(150, 255)));
    }

    for (let i = 0; i < rowCount; i++) {
        let category = table.getString(i, "Category");
        let value = Number(table.getString(i, "Value"));
        let barHeight = (value / maxValue) * availableHeight;
        
        let x = margins + i * barWidth;
        let y = height - margins - barHeight;

        // Apply unique color to each bar
        fill(colors[i]);
        rect(x, y, barWidth - 5, barHeight);

        // Add category labels
        fill(0);
        textAlign(CENTER, CENTER);
        textSize(12);
        text(category, x + barWidth / 2, height - margins + 15);
    }
}


