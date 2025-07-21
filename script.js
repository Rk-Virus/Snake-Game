//game constants
let direction = { x: 0, y: 0 }
const gameMusic = new Audio('assets/music.mp3')
const eatSound = new Audio('assets/eat.wav')
const gameOverSound = new Audio('assets/game over.wav')
const board = document.getElementById('board')
gameMusic.volume = 0.4
gameOverSound.volume = 0.4
let ptime = 0;
let fps = 8;
let snakeArr = [
    { x: 7, y: 5 },
    { x: 6, y: 5 },
    { x: 5, y: 5 },

]
let a = 1;
let b = 30;
let food = { x: Math.floor(Math.random() * (b - a + 1)) + a, y: Math.floor(Math.random() * (b - a + 1)) + a }
const speed = 5;
let gameOver = false;
let score = 0;
const keys = {}
let highscore = 0;
let highScore = localStorage.getItem("highScore") || 0;
highScore = parseInt(highScore);

//game methods
const main = (ctime) => {
    // console.log((ctime - ptime) / 1000)
    window.requestAnimationFrame(main);
    if ((ctime - ptime) / 1000 < 1 / fps) {
        return;
    }
    ptime = ctime
    gameEngine();
}

function gameEngine() {
    if (gameOver) return;

    //move the snake
    if (direction.x || direction.y) {
        for (let i = snakeArr.length - 2; i >= 0; i--) {
            snakeArr[i + 1] = { ...snakeArr[i] };
        }
        snakeArr[0].x += direction.x;
        snakeArr[0].y += direction.y;
    }

    //Snake head collision
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        gameOver = true;

        setTimeout(() => {
            alert(`Game Over!`);
            window.location.reload();
        }, 100);
    }

    board.innerHTML = ''
    //display the food
    let foodElement = document.createElement('div')
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food')
    board.appendChild(foodElement)

    //display the snake
    snakeArr.forEach((box, index) => {
        let snakeElement = document.createElement('div')
        snakeElement.style.gridRowStart = box.y;
        snakeElement.style.gridColumnStart = box.x;
        if (index === 0) snakeElement.classList.add('snake-head')
        else {
            snakeElement.style.borderRadius = `${20 + index}%`;
            snakeElement.classList.add('snake-body')
        }
        board.appendChild(snakeElement)
    })

    //display scores
    scoreText.innerHTML = `Score: ${score}`
    highScoreText.innerHTML = `High Score: ${highScore}`;


    //when snake eats food
    if (food.x === snakeArr[0].x && food.y === snakeArr[0].y) {
        eatSound.play()
        snakeArr.unshift({ ...food })
        //increament score
        score += 10;
        //update highscore
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
        }
        //generating food at random
        food = { x: Math.floor(Math.random() * (b - a + 1)) + a, y: Math.floor(Math.random() * (b - a + 1)) + a }
    }


}

function isCollide(snakeArr) {
    // Collision with itself
    for (let i = 1; i < snakeArr.length; i++) {
        if (snakeArr[i].x === snakeArr[0].x && snakeArr[i].y === snakeArr[0].y) {
            return true;
        }
    }

    // Collision with wall
    return (
        snakeArr[0].x < 0 || snakeArr[0].x >= 32 ||
        snakeArr[0].y < 0 || snakeArr[0].y >= 32
    );
}

//game loop
window.requestAnimationFrame(main)

//direction controlls
window.addEventListener('keydown', e => {
    gameMusic.play();
    keys[e.key] = true;

    // Diagonal check
    if (keys['ArrowUp'] && keys['ArrowRight']) {
        direction = { x: 1, y: -1 };
    } else if (keys['ArrowUp'] && keys['ArrowLeft']) {
        direction = { x: -1, y: -1 };
    } else if (keys['ArrowDown'] && keys['ArrowRight']) {
        direction = { x: 1, y: 1 };
    } else if (keys['ArrowDown'] && keys['ArrowLeft']) {
        direction = { x: -1, y: 1 };
    } else {
        // Single key straight movement
        switch (e.key) {
            case 'ArrowUp':
                direction = { x: 0, y: -1 };
                break;
            case 'ArrowDown':
                direction = { x: 0, y: 1 };
                break;
            case 'ArrowLeft':
                direction = { x: -1, y: 0 };
                break;
            case 'ArrowRight':
                direction = { x: 1, y: 0 };
                break;
        }
    }
});

window.addEventListener('keyup', e => {
    keys[e.key] = false;
});
