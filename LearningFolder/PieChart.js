let table;

function preload() {
    // Load the CSV file before the sketch starts
    table = loadTable("data.csv", "csv", "header");
}

function setup() {
    createCanvas(600, 400);
    background(240);
    print(table.getRowCount() + " rows loaded"); // Debugging statement to confirm data load
}

