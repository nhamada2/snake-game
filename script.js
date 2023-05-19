// Get references to the game board canvas and scoreboard
const canvas = document.getElementById('gameBoard');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const tileSize = canvas.width / gridSize;
const scoreBoard = document.getElementById('scoreBoard');

// Get references to the start and try again buttons
const buttonContainer = document.getElementById('buttonContainer');
const startBtn = document.getElementById('startBtn');
const tryAgainBtn = document.getElementById('tryAgainBtn');

// Get a reference to the overlay div
const overlay = document.getElementById('overlay');

// Get references to the snake logo canvas and context
const snakeLogoCanvas = document.getElementById('snake-logo');
const snakeLogoCtx = snakeLogoCanvas.getContext('2d');

// Get a reference to the pause button and add a click event listener
const pauseBtn = document.getElementById('pauseBtn');
pauseBtn.addEventListener('click', togglePause);

// Variable to track whether the game is paused or not
let isPaused = false;

// Hide the pause button until the game starts
pauseBtn.style.display = 'none';

// Initialize snake, food, velocity, and score variables
let snake = [{x: 10, y: 10}];
let food = {x: 5, y: 5};
let velocity = {x: 0, y: 0};
let score = 0;

// Initialize snake logo variables
let snakeLogo = [
    {x: 2, y: 1},
    {x: 3, y: 1},
    {x: 4, y: 1},
    {x: 4, y: 2},
    {x: 4, y: 3},
    {x: 3, y: 3},
    {x: 2, y: 3}
];
let snakeLogoVelocity = {x: 0, y: -1};

// Listen for keydown events to control the snake's movement
document.addEventListener('keydown', moveSnake);

// Add click event listeners to the buttons
startBtn.addEventListener('click', startGame);
tryAgainBtn.addEventListener('click', tryAgain);

// Update the snake's velocity based on arrow key inputs
function moveSnake(e) {
    switch(e.key) {
        case 'ArrowUp':    if (velocity.y === 0) velocity = {x: 0, y: -1}; break;
        case 'ArrowDown':  if (velocity.y === 0) velocity = {x: 0, y: 1}; break;
        case 'ArrowLeft':  if (velocity.x === 0) velocity = {x: -1, y: 0}; break;
        case 'ArrowRight': if (velocity.x === 0) velocity = {x: 1, y: 0}; break;
    }
}

// Main game loop that takes the pause state into account
function main() {
    // Check if the game is running and not paused before executing the loop
    if (isRunning && !isPaused) {
        setTimeout(function() {
            requestAnimationFrame(main);
            updateGame();
            drawGame();
        }, 1000 / 10);
    }
}

// Update the game state (snake position, food position, collisions, score)
function updateGame() {
    // Calculate the new head position based on the current velocity
    const head = {x: snake[0].x + velocity.x, y: snake[0].y + velocity.y};

    // Check if the head of the snake has collided with the food
    if (head.x === food.x && head.y === food.y) {
        // Generate a new food position at a random location on the grid
        food = {
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize)
        };
        // Increment the score and update the scoreboard
        score++;
        updateScore();
    } else {
        // If the snake did not eat food, remove the last segment of the snake
        snake.pop();
    }

    // Add the new head position to the front of the snake
    snake.unshift(head);

    // Check if the snake has collided with the walls
    if (head.x < 0 || head.y < 0 || head.x >= gridSize || head.y >= gridSize) {
        // Reset the game if the snake has collided with the walls
        resetGame();
    }

    // Check if the snake has collided with itself
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            // Reset the game if the snake has collided with itself
            resetGame();
            break;
        }
    }
}

// Draw the game elements (snake, food) on the canvas
function drawGame() {
    // Clear the canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the snake
    ctx.fillStyle = 'lime';
    for (let cell of snake) {
        ctx.fillRect(cell.x * tileSize, cell.y * tileSize, tileSize, tileSize);
    }

    // Draw the food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);
}

// Update the scoreboard with the current score
function updateScore() {
    scoreBoard.innerText = `Score: ${score}`;
}

// Reset the game when the snake collides with the wall or itself
function resetGame() {
    isRunning = false;
    pauseBtn.style.display = 'none'; // Hide the pause button when the game ends
    overlay.classList.remove('hidden'); // Show the overlay
    buttonContainer.style.display = 'block';
    tryAgainBtn.style.display = 'inline-block';
    snake = [{x: 10, y: 10}];
    velocity = {x: 0, y: 0};
    updateScore(true);
    score = 0; // Reset the score after displaying the final score
}

// Draw a simple snake logo
function drawSnakeLogo() {
    snakeLogoCtx.fillStyle = 'lime';
    snakeLogoCtx.fillRect(10, 30, 10, 10);
    snakeLogoCtx.fillRect(20, 30, 10, 10);
    snakeLogoCtx.fillRect(30, 30, 10, 10);
    snakeLogoCtx.fillRect(30, 20, 10, 10);
    snakeLogoCtx.fillRect(30, 10, 10, 10);
    snakeLogoCtx.fillRect(20, 10, 10, 10);
    snakeLogoCtx.fillRect(10, 10, 10, 10);
}

drawSnakeLogo(); // Draw the snake logo on the canvas

// Animate the snake logo
function animateSnakeLogo() {
    // Clear the snake logo canvas
    snakeLogoCtx.fillStyle = 'black';
    snakeLogoCtx.fillRect(0, 0, snakeLogoCanvas.width, snakeLogoCanvas.height);

    // Draw the snake logo
    snakeLogoCtx.fillStyle = 'lime';
    for (let cell of snakeLogo) {
        snakeLogoCtx.fillRect(cell.x * 10, cell.y * 10, 10, 10);
    }

    // Update the snake logo's position
    const head = {x: snakeLogo[0].x + snakeLogoVelocity.x, y: snakeLogo[0].y + snakeLogoVelocity.y};

    // Check if the snake logo reaches the edge of the canvas
    if (head.x < 0 || head.y < 0 || head.x >= snakeLogoCanvas.width / 10 || head.y >= snakeLogoCanvas.height / 10) {
        // Reverse the direction if the snake logo reaches the edge of the canvas
        snakeLogoVelocity = {x: -snakeLogoVelocity.y, y: snakeLogoVelocity.x};
        head.x = snakeLogo[0].x + snakeLogoVelocity.x;
        head.y = snakeLogo[0].y + snakeLogoVelocity.y;
    }

    // Add the new head position to the front of the snake logo
    snakeLogo.unshift(head);
    snakeLogo.pop();

    // Call animateSnakeLogo again with a delay to slow down the animation
    setTimeout(() => {
        requestAnimationFrame(animateSnakeLogo);
    }, 100);
}

// Start the animation
animateSnakeLogo();

// Start the game when the "Start" button is clicked
function startGame() {
    isRunning = true;
    overlay.classList.add('hidden'); // Hide the overlay
    startBtn.style.display = 'none';
    tryAgainBtn.style.display = 'none';
    pauseBtn.style.display = 'inline'; // Show the pause button
    main();
}

// Pause or resume the game when the "Pause" button is clicked
function togglePause() {
    if (isRunning) {
        isRunning = false;
        pauseBtn.innerHTML = '&#9658;'; // Play symbol
        pauseBtn.title = 'Play'; // Set the hover message to "Play"
    } else {
        isRunning = true;
        pauseBtn.innerHTML = '&#10074;&#10074;'; // Pause symbol
        pauseBtn.title = 'Pause'; // Set the hover message to "Pause"
        main();
    }
}

// Restart the game when the "Try Again" button is clicked
function tryAgain() {
    pauseBtn.style.display = 'none'; // Hide the pause button when the game ends
    resetGame();
    updateScore();
    tryAgainBtn.style.display = 'none';
    startGame();
}