CANVAS_WIDTH = 800
CANVAS_HEIGHT = 600
ROW_HEIGHT = 50
NEW_ROW_INTERVAL = 200

// A row can be a road or a median
let rows = [];

function setup() {
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
}

function draw() {
    background("green");

    rows.forEach(row => {
        drawRow(row)
    })
    
    if (frameCount % NEW_ROW_INTERVAL == 0) { 
        // At a steady rate, generate new rows at the top of the canvas
        rows.forEach(row => {
            row.y = row.y + ROW_HEIGHT
        })

        // Randomly decide to generate a road with cars or a grassy median
        if (random(0,1) < .6) {
            rows.push(newRoad())
        } else {
            rows.push(newMedian())
        }

        // Filter out rows that go below the bottom of the canvas
        rows = rows.filter(row => {
            return row.y < CANVAS_HEIGHT
        })
    }
}

// A brand new road that starts at the top of the canvas
function newRoad() {
    return {
        y: 0,
        cars: [newCar()],
        color: "grey"
    }
}

// A brand new median that starts at the top of the canvas
function newMedian() {
    return {
        y: 0,
        cars: [],
        color: "green"
    }
}

// Draw a row, which could be a road or a canvas
function drawRow(row) {
    fill(row.color)
    rect(0, row.y, CANVAS_WIDTH, ROW_HEIGHT)

    // Draw cars on the road
    row.cars.forEach(car => {
        // Make sure car stays on its road
        car.y = row.y
        // Move the car along the road at its assigned speed
        car.x = car.x + car.speed

        // Restart the car when it hits the end of the road
        if (car.x > CANVAS_WIDTH) {
            car.x = 0
        }

        drawCar(car)
    })
}

// Brand new car
function newCar() {
    return {
        x: 0,
        y: 0,
        speed: random(.5, 3)
    }
}

// Draw a car at (x, y)
function drawCar(car) {
    fill("red")
    rect(car.x, car.y, 100, ROW_HEIGHT)
}
