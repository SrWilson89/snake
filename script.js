const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }]; // Posición inicial de la serpiente
let direction = { x: 0, y: 0 }; // Dirección inicial (sin movimiento)
let food = { x: 5, y: 5 }; // Posición inicial de la comida
let powerUp = null;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let speed = 100; // Velocidad inicial del juego
let isPaused = false;
let isGameOver = false;

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
    if (isPaused || isGameOver) return;
    update();
    draw();
    setTimeout(gameLoop, speed);
}

function update() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Verificar colisión con las paredes
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }

    // Verificar colisión consigo misma
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    // Mover la serpiente
    snake.unshift(head); // Añadir nueva cabeza

    // Verificar si la serpiente come la comida
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreElement.textContent = score;
        playSound(eatSound);
        placeFood();
        if (score % 5 === 0) placePowerUp();
    } else {
        snake.pop(); // Eliminar la cola si no come
    }

    // Verificar si la serpiente come el power-up
    if (powerUp && head.x === powerUp.x && head.y === powerUp.y) {
        if (powerUp.type === 'gold') score += 5;
        else if (powerUp.type === 'invincible') activateInvincibility();
        else if (powerUp.type === 'shrink') shrinkSnake();
        powerUp = null;
        playSound(eatSound);
    }
}

function draw() {
    // Limpiar el canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar la serpiente
    ctx.fillStyle = 'lime';
    snake.forEach(segment => ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize));

    // Dibujar la comida
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    // Dibujar el power-up si existe
    if (powerUp) {
        ctx.fillStyle = powerUp.type === 'gold' ? 'gold' : powerUp.type === 'invincible' ? 'purple' : 'pink';
        ctx.fillRect(powerUp.x * gridSize, powerUp.y * gridSize, gridSize, gridSize);
    }
}

function placeFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);

    // Asegurarse de que la comida no aparezca sobre la serpiente
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
    isGameOver = true;
    playSound(gameOverSound);
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        highScoreElement.textContent = highScore;
    }
    setTimeout(resetGame, 1000); // Retraso antes de reiniciar
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 }; // Reiniciar la dirección
    score = 0;
    scoreElement.textContent = score;
    placeFood();
    powerUp = null;
    isGameOver = false;
}

function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

// Capturar eventos del teclado
window.addEventListener('keydown', e => {
    if (e.key === 'p') isPaused = !isPaused;
    if (isGameOver) return; // Ignorar movimientos si el juego ha terminado

    switch (e.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -1 }; // Mover arriba
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: 1 }; // Mover abajo
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -1, y: 0 }; // Mover izquierda
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: 1, y: 0 }; // Mover derecha
            break;
    }
});

// Iniciar el juego
placeFood();
gameLoop();