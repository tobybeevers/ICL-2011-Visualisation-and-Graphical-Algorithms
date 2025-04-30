// Video Game Sales Dashboard - Assignment One

// Set global variables to store references to the bar chart and pie chart instances
let barChart, pieChart;

// ---------------------------------------------
// Task 1: Main Function to Start Visualisation
// ---------------------------------------------
/**
 * This function is the entry point of the visualisation. It loads the data, creates the charts, and sets up interactive controls.
 */
async function startVisualization() {
    // Load and prepare the data from the CSV file
    const gamesData = await loadGameData();

    // Check if data was successfully loaded
    if (gamesData.length === 0) {
        alert("Failed to load game data. Please check your CSV file.");
        return;
    }

    // Create the bar chart and pie chart using the loaded data
    createBarChart(gamesData);
    createPieChart(gamesData);

    // Set up interactive controls for user interaction
    setupControls(gamesData);
}

// ---------------------------------------------
// Task 2: Load and Parse CSV Data
// ---------------------------------------------
/**
 * This function fetches the CSV file, parses its content, and converts it into a usable format.
 * @returns {Array} An array of game objects with relevant sales data.
 */
async function loadGameData() {
    try {
        // Fetch the CSV file
        const response = await fetch('vgsales.csv');
        const csvData = await response.text();

        // Split the CSV data into rows
        const rows = csvData.split('\n');

        // Initialise an array to store parsed game data
        const games = [];

        // For loop through each row (skipping the header row)
        for (let i = 1; i < rows.length; i++) {
            if (!rows[i]) continue; // Skip empty rows

            // Split the row into columns
            const columns = rows[i].split(',');

            // Validate and extract relevant data
            if (columns.length >= 11 && !isNaN(columns[3])) {
                games.push({
                    Year: parseInt(columns[3]), // Year of release
                    Genre: columns[4], // Genre of the game
                    NA_Sales: parseFloat(columns[6]) || 0, // Sales in North America
                    EU_Sales: parseFloat(columns[7]) || 0, // Sales in Europe
                    JP_Sales: parseFloat(columns[8]) || 0, // Sales in Japan
                    Other_Sales: parseFloat(columns[9]) || 0, // Sales in other regions
                    Global_Sales: parseFloat(columns[10]) || 0 // Total global sales
                });
            }
        }

        return games; // Return the parsed data
    } catch (error) {
        console.error("Error loading data:", error);
        return []; // Return an empty array if an error occurs
    }
}

// ---------------------------------------------
// Task 3: Create the Bar Chart
// ---------------------------------------------
/**
 * This function creates a stacked bar chart to visualise yearly sales by region.
 * @param {Array} games - The array of game data.
 */
function createBarChart(games) {
    // Extract all unique years from the data
    const years = [];
    games.forEach(game => {
        if (!years.includes(game.Year)) years.push(game.Year);
    });
    years.sort((a, b) => a - b); // Sort years in ascending order

    // Calculate total sales per year for each region
    const naSales = years.map(year => {
        return games.filter(g => g.Year === year)
                   .reduce((sum, g) => sum + g.NA_Sales, 0);
    });

    const euSales = years.map(year => {
        return games.filter(g => g.Year === year)
                   .reduce((sum, g) => sum + g.EU_Sales, 0);
    });

    const jpSales = years.map(year => {
        return games.filter(g => g.Year === year)
                   .reduce((sum, g) => sum + g.JP_Sales, 0);
    });

    const otherSales = years.map(year => {
        return games.filter(g => g.Year === year)
                   .reduce((sum, g) => sum + g.Other_Sales, 0);
    });

    // Create the bar chart using Chart.js
    const ctx = document.getElementById('stacked-bar-chart').getContext('2d');
    barChart = new Chart(ctx, {
        type: 'bar', // Chart type: bar chart
        data: {
            labels: years, // X-axis labels (years)
            datasets: [
                { label: 'North America', data: naSales, backgroundColor: '#1b9e77' },
                { label: 'Europe', data: euSales, backgroundColor: '#d95f02' },
                { label: 'Japan', data: jpSales, backgroundColor: '#7570b3' },
                { label: 'Other', data: otherSales, backgroundColor: '#66a61e' }
            ]
        },
        options: {
            responsive: true, // Make the chart responsive
            scales: {
                x: { stacked: true, title: { display: true, text: 'YEAR' } },
                y: { 
                    stacked: true, 
                    title: { display: true, text: 'SALES (in millions)' },
                    beginAtZero: true // Start Y-axis at zero
                }
            },
            plugins: {
                title: { 
                    display: true, 
                    text: ['VIDEO GAME SALES BY REGION','Select Region to Filter'],
                    font: { size: 16 }
                }
            }
        }
    });
}

// ---------------------------------------------
// Task 4: Create and Update the Pie Chart
// ---------------------------------------------
/**
 * This function initialises the pie chart with default data.
 * @param {Array} games - The array of game data.
 */
function createPieChart(games) {
    updatePieChart(games, 'all'); // Default to showing all years
}

/**
 * This function updates the pie chart based on the selected year.
 * @param {Array} games - The array of game data.
 * @param {string|number} selectedYear - The selected year or 'all' for all years.
 */
function updatePieChart(games, selectedYear) {
    // Filter games based on the selected year
    const filteredGames = selectedYear === 'all' 
        ? games 
        : games.filter(g => g.Year === parseInt(selectedYear));

    // Group sales data by genre
    const genreSales = {};
    filteredGames.forEach(game => {
        if (!genreSales[game.Genre]) {
            genreSales[game.Genre] = 0;
        }
        genreSales[game.Genre] += game.Global_Sales;
    });

    // Prepare data for the pie chart
    const genres = Object.keys(genreSales);
    const salesData = genres.map(genre => genreSales[genre]);

    // Create or update the pie chart
    const ctx = document.getElementById('doughnut-chart').getContext('2d');
    if (pieChart) {
        // Update existing chart
        pieChart.data.labels = genres;
        pieChart.data.datasets[0].data = salesData;
        pieChart.options.plugins.title.text = `Sales by Genre ${selectedYear === 'all' ? '' : `(${selectedYear})`}`;
        pieChart.update();
    } else {
        // Create a new chart
        pieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: genres,
                datasets: [{
                    data: salesData,
                    backgroundColor: [
                        '#1b9e77', // Teal
                        '#d95f02', // Orange
                        '#7570b3', // Purple
                        '#e7298a', // Pink
                        '#66a61e', // Green
                        '#e6ab02', // Yellow
                        '#a6761d', // Brown
                        '#666666', // Gray
                        '#117733', // Dark Green
                        '#332288', // Dark Blue
                        '#88CCEE', // Light Blue
                        '#CC6677', // Coral
                        '#DDCC77', // Sand
                        '#AA4499', // Magenta
                        '#44AA99', // Turquoise
                        '#999933'  // Olive
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: [`SALES BY GENRE ${selectedYear === 'all' ? '' : `(${selectedYear})`}`, 'Select Genre to Filter'],
                        font: { size: 16 }
                    },
                    datalabels: {
                        formatter: (value, context) => {
                            const total = context.dataset.data.reduce((sum, val) => sum + val, 0) || 1; // Avoid division by zero
                            const percentage = ((value / total) * 100).toFixed(1); // Calculate percentage
                            return `${percentage}%`; // Show percentage
                        },
                        color: '#fff', // Label color
                        font: {
                            size: 12
                        },
                        anchor: 'end', // Position of the label
                        align: 'start', // Alignment of the label
                        offset: 50
                    }
                }
            },
            plugins: [ChartDataLabels] // Register the datalabels plugin
        }); // Close the pieChart creation block
    } // Close the else block
} // Close the updatePieChart function

// ---------------------------------------------
// Task 5: Set Up Interactive Controls
// ---------------------------------------------
/**
 * This function sets up the slider and dropdown controls for user interaction.
 * @param {Array} games - The array of game data.
 */
function setupControls(games) {
    // Extract all unique years
    const years = [];
    games.forEach(game => {
        if (!years.includes(game.Year)) years.push(game.Year);
    });
    years.sort((a, b) => a - b);

    // Set up the year slider
    const yearSlider = document.getElementById('year-slider');
    const yearDisplay = document.getElementById('year-display');

    yearSlider.min = Math.min(...years); // Set minimum year
    yearSlider.max = Math.max(...years); // Set maximum year
    yearSlider.value = Math.max(...years); // Default to the latest year
    yearDisplay.textContent = Math.max(...years); // Display the default year

    // Add event listener to update the bar chart when the slider value changes
    yearSlider.addEventListener('input', function() {
        const selectedYear = parseInt(this.value);
        yearDisplay.textContent = selectedYear;

        // Filter the bar chart to show only up to the selected year
        const filteredYears = years.filter(y => y <= selectedYear);
        barChart.data.labels = filteredYears;

        // Update each dataset
        barChart.data.datasets.forEach(dataset => {
            dataset.data = dataset.data.slice(0, filteredYears.length);
        });

        barChart.update(); // Refresh the chart
    });

    // Set up the year selector for the pie chart
    const yearSelect = document.getElementById('genre-year-selector');

    // Add options to the dropdown (e.g., 'all', 2020, 2015, etc.)
    ['all', 2020, 2015, 2010, 2005, 2000].forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year === 'all' ? 'All Years' : year;
        yearSelect.appendChild(option);
    });

    // Add event listener to update the pie chart when the dropdown value changes
    yearSelect.addEventListener('change', function() {
        updatePieChart(games, this.value);
    });
}

// ---------------------------------------------
// Task 6: Start Visualisation on Page Load
// ---------------------------------------------
/**
 * Add an event listener to start the visualisation when the DOM is fully loaded.
 */
window.addEventListener('DOMContentLoaded', startVisualization);