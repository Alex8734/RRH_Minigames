let canvas;
let ctx;
document.addEventListener('DOMContentLoaded', (event) =>{
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvas.height = 1500;
    canvas.width = 1500;
    canvas.style.height = Math.floor(canvas.clientHeight * window.devicePixelRatio) / 1.2 + 'px';
    canvas.style.width = Math.floor(canvas.clientWidth * window.devicePixelRatio) / 1.2 + 'px';
    init();
});

function init()
{
    gameLoop();
}

function gameLoop()
{
    drawGame();
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    for (let col = 1; col < 3; col++) {
        const x = (canvas.width / 3) * col;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
    }
    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;
    ctx.stroke();

    // Draw horizontal grid lines
    ctx.beginPath();
    for (let row = 1; row < 3; row++) {
        const y = (canvas.height / 3) * row;
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
    }
    ctx.stroke();
}