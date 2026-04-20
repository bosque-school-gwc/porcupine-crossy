CANVAS_WIDTH = 800
CANVAS_HEIGHT = 600
ROW_HEIGHT = 50
NEW_ROW_INTERVAL = 100
CAR_WIDTH = 100

// A row can be a road or a median
let rows = [];
const wilbert = {
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2 - ROW_HEIGHT
}

function setup() {
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    
}

let gameOver = false;

function draw() {
    background("green");

    if (gameOver) {
        background("red")
        textSize(32);
        text("Game over", 350, 300)
        return
    }

    rows.forEach(row => {
        drawRow(row)
    })

    moveWilbert()
    drawWilbert()
    
    rows.forEach(row => {
        row.y = row.y + 1
    })

    checkGameOver()

    wilbert.y += 1
  

    if (frameCount % ROW_HEIGHT == 0) { 
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

function checkGameOver() {
    if (wilbert.y > CANVAS_HEIGHT - 50 || checkCollision()) {
        gameOver = true
    }
}

function checkCollision() {
    return rows.some(row => {
        return row.cars.some(car => {
            if (
                wilbert.x + ROW_HEIGHT >= car.x && 
                wilbert.x <= (car.x + CAR_WIDTH) &&
                wilbert.y == car.y
            ) {
                return true
            }
        })
    })
}

let lastVerticalMove = 0
function canMoveVertically() {
    return lastVerticalMove < frameCount- 10
}

let lastHorizontalMove = 0
function canMoveHorizontally() {
    return lastHorizontalMove < frameCount- 10
}

function moveWilbert() {
    if (keyIsDown(DOWN_ARROW) && canMoveVertically()) {
        wilbert.y += ROW_HEIGHT
        lastVerticalMove = frameCount
    } else if (keyIsDown(UP_ARROW) && canMoveVertically()) {
        wilbert.y -= ROW_HEIGHT
        lastVerticalMove = frameCount
    } else if (keyIsDown(LEFT_ARROW) && canMoveHorizontally()) {
        wilbert.x -= ROW_HEIGHT
        lastHorizontalMove = frameCount
    } else if (keyIsDown(RIGHT_ARROW) && canMoveHorizontally()) {
        wilbert.x += ROW_HEIGHT
        lastHorizontalMove = frameCount
    }
}

function drawWilbert() {
    fill("brown")
    rect(wilbert.x, wilbert.y, ROW_HEIGHT, ROW_HEIGHT)
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
        x: random(0, CANVAS_WIDTH),
        y: 0,
        speed: random(.5, 3)
    }
}

// Draw a car at (x, y)
function drawCar(car) {
    fill("red")
    rect(car.x, car.y, CAR_WIDTH, ROW_HEIGHT)
}
