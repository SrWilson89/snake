const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: 5, y: 5 };
let powerUp = null;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let speed = 100;
let isPaused = false;

const eatSound = new Audio('eat.mp3');
const gameOverSound = new Audio('gameover.mp3');

highScoreElement.textContent = highScore;

function setDifficulty(level) {
    if (level === 'easy') speed = 150;
    else if (level === 'medium') speed = 100;
    else if (level === 'hard') speed = 50;
    resetGame();
}

function gameLoop() {
    if (isPaused) return;
    update();
    draw();
    setTimeout(gameLoop, speed);
}

function update() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Check for collision with walls
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }

    // Check for collision with itself
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    // Check if snake eats the food
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreElement.textContent = score;
        playSound(eatSound);
        placeFood();
        if (score % 5 === 0) placePowerUp();
    } else {
        snake.pop();
    }

    // Check if snake eats the power-up
    if (powerUp && head.x === powerUp.x && head.y === powerUp.y) {
        if (powerUp.type === 'gold') score += 5;
        else if (powerUp.type === 'invincible') activateInvincibility();
        else if (powerUp.type === 'shrink') shrinkSnake();
        powerUp = null;
        playSound(eatSound);
    }
}

function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'lime';
    snake.forEach(segment => ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize));

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    if (powerUp) {
        ctx.fillStyle = powerUp.type === 'gold' ? 'gold' : powerUp.type === 'invincible' ? 'purple' : 'pink';
        ctx.fillRect(powerUp.x * gridSize, powerUp.y * gridSize, gridSize, gridSize);
    }
}

function placeFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);

    // Ensure food doesn't spawn on the snake
    if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        placeFood();
    }
}

function placePowerUp() {
    powerUp = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount),
        type: ['gold', 'invincible', 'shrink'][Math.floor(Math.random() * 3)]
    };
}

function activateInvincibility() {
    // Implementar lógica de invencibilidad
}

function shrinkSnake() {
    // Implementar lógica para reducir el tamaño de la serpiente
}

function gameOver() {
    playSound(gameOverSound);
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        highScoreElement.textContent = highScore;
    }
    resetGame();
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    score = 0;
    scoreElement.textContent = score;
    placeFood();
    powerUp = null;
}

function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

window.addEventListener('keydown', e => {
    if (e.key === 'p') isPaused = !isPaused;
    switch (e.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
});

function moveUp() { if (direction.y === 0) direction = { x: 0, y: -1 }; }
function moveDown() { if (direction.y === 0) direction = { x: 0, y: 1 }; }
function moveLeft() { if (direction.x === 0) direction = { x: -1, y: 0 }; }
function moveRight() { if (direction.x === 0) direction = { x: 1, y: 0 }; }

placeFood();
gameLoop();