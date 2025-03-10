const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
const soundC = new Audio('sonido/blaster.mp3');

canvas.height = 500;
canvas.width = 500;
canvas.style.background = "#ff8";

class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.baseColor = color;
        this.color = color;
        this.text = text;
        this.speed = speed;
        this.dx = (Math.random() < 0.5 ? -1 : 1) * this.speed;
        this.dy = (Math.random() < 0.5 ? -1 : 1) * this.speed;
        this.collided = false;
    }

    draw(context) {
        context.beginPath();
        context.fillStyle = this.color;
        context.strokeStyle = this.color;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillText(this.text, this.posX, this.posY);
        context.lineWidth = 2;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.fill();
        context.stroke();
        context.closePath();
    }

    update(context) {
        this.draw(context);
        
        if (this.posX + this.radius > canvas.width || this.posX - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.posY + this.radius > canvas.height || this.posY - this.radius < 0) {
            this.dy = -this.dy;
        }
        
        this.posX += this.dx;
        this.posY += this.dy;
    }
}

function detectCollision(circle1, circle2) {
    let dx = circle1.posX - circle2.posX;
    let dy = circle1.posY - circle2.posY;
    let distance = Math.sqrt(dx * dx + dy * dy);
    return distance < circle1.radius + circle2.radius;
}

function handleCollisions(circles) {
    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            if (detectCollision(circles[i], circles[j])) {
                circles[i].dx = -circles[i].dx;
                circles[i].dy = -circles[i].dy;
                circles[j].dx = -circles[j].dx;
                circles[j].dy = -circles[j].dy;
                
                if (!circles[i].collided) {
                    circles[i].color =  "rgb(128,9,34)";
                    circles[j].color = "rgb(128,9,34)";
                } else {
                    circles[i].color = circles[i].baseColor;
                    circles[j].color = circles[j].baseColor;
                }
                
                circles[i].collided = !circles[i].collided;
                circles[j].collided = !circles[j].collided;

                soundC.currentTime = 0; // Reinicia el sonido para que se pueda volver a reproducir
                soundC.play().catch(error => console.log("Error al reproducir el sonido:", error));
            }
        }
    }
}

function generateCircles(n) {
    let circles = [];
    for (let i = 0; i < n; i++) {
        let radius = Math.floor(Math.random() * 30) + 20;
        let x = Math.random() * (canvas.width - radius * 2) + radius;
        let y = Math.random() * (canvas.height - radius * 2) + radius;
        let speed = Math.random() * 2 + 1;
        circles.push(new Circle(x, y, radius, "blue", (i + 1).toString(), speed));
    }
    return circles;
}

let circles = generateCircles(5);


function updateCanvas() {
    requestAnimationFrame(updateCanvas);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    circles.forEach(circle => circle.update(ctx));
    handleCollisions(circles);
}

updateCanvas();