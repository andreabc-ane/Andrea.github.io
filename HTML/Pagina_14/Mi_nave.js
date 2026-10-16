
const canvas = document.getElementById("spaceCanvas");
const context = canvas.getContext("2d");

let paused = false;
const keys = {};
let stars = [];

function Navecita() {
    this.x = canvas.clientWidth / 2;
    this.y = canvas.clientHeight / 2;
    this.rotation = -Math.PI / 2;

    this.speedX = 0;
    this.speedY = 0;

    this.acceleration = 0.16;
    this.friction = 0.985;
    this.maxSpeed = 5;
    this.showFlame = false;
}

let nave = new Navecita();

// Ajustar el canvas al tamaño visible
function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (nave) {
        nave.x = Math.max(25, Math.min(nave.x, rect.width - 25));
        nave.y = Math.max(25, Math.min(nave.y, rect.height - 25));
    }

    createStars();
}

// Crear estrellas
function createStars() {
    stars = [];

    for (let i = 0; i < 160; i++) {
        stars.push({
            x: Math.random() * canvas.clientWidth,
            y: Math.random() * canvas.clientHeight,
            size: Math.random() * 1.8 + 0.5,
            alpha: Math.random() * 0.6 + 0.3
        });
    }
}

// Dibujar fondo espacial pastel
function drawBackground() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    context.clearRect(0, 0, w, h);

    const gradient = context.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, "#17143b");
    gradient.addColorStop(0.5, "#30245e");
    gradient.addColorStop(1, "#101c40");

    context.fillStyle = gradient;
    context.fillRect(0, 0, w, h);

    // Nebulosa luminosa
    const nebula = context.createRadialGradient(
        w * 0.72, h * 0.3, 5,
        w * 0.72, h * 0.3, w * 0.5
    );

    nebula.addColorStop(0, "rgba(172, 133, 255, 0.38)");
    nebula.addColorStop(1, "rgba(172, 133, 255, 0)");

    context.fillStyle = nebula;
    context.fillRect(0, 0, w, h);

    // Estrellas
    stars.forEach(star => {
        context.beginPath();
        context.arc(star.x, star.y, star.size, 0, Math.PI * 2);

        context.fillStyle =
            `rgba(255, 255, 255, ${star.alpha})`;

        context.fill();
    });

    // Planeta
    const px = w * 0.76;
    const py = h * 0.30;
    const radius = Math.min(43, w * 0.12);

    // Anillo detrás del planeta
    context.beginPath();
    context.ellipse(px, py + 5, radius * 1.5, radius * 0.35, -0.2, 0, Math.PI * 2);
    context.strokeStyle = "#b7c6ff";
    context.lineWidth = 4;
    context.stroke();

    const planet = context.createRadialGradient(
        px - 14, py - 15, 2,
        px, py, radius
    );

    planet.addColorStop(0, "#f0dcff");
    planet.addColorStop(0.55, "#a88be8");
    planet.addColorStop(1, "#54468c");

    context.beginPath();
    context.arc(px, py, radius, 0, Math.PI * 2);
    context.fillStyle = planet;
    context.fill();

    // Detalles del planeta
    context.save();
    context.beginPath();
    context.arc(px, py, radius, 0, Math.PI * 2);
    context.clip();

    context.strokeStyle = "rgba(255,255,255,0.25)";
    context.lineWidth = 5;

    for (let i = -2; i <= 2; i++) {
        context.beginPath();
        context.ellipse(
            px, py + i * 12,
            radius, 5, -0.15, 0, Math.PI * 2
        );
        context.stroke();
    }

    context.restore();

    // Nombre del sector
    context.fillStyle = "#dcd5ff";
    context.font = "11px Arial";
    context.fillText("SECTOR 07  /  DEEP SPACE", 18, 25);
}

// Dibujar la nave
Navecita.prototype.draw = function() {
    context.save();

    context.translate(this.x, this.y);
    context.rotate(this.rotation);

    // Llama de propulsión
    if (this.showFlame) {
        context.beginPath();
        context.moveTo(-12, -6);
        context.lineTo(-28 - Math.random() * 12, 0);
        context.lineTo(-12, 6);
        context.closePath();

        context.fillStyle = "#ff9b70";
        context.fill();

        context.beginPath();
        context.moveTo(-12, -3);
        context.lineTo(-23 - Math.random() * 6, 0);
        context.lineTo(-12, 3);
        context.closePath();

        context.fillStyle = "#fff0a6";
        context.fill();
    }

    // Alas
    context.beginPath();
    context.moveTo(-10, -7);
    context.lineTo(-18, -17);
    context.lineTo(5, -11);
    context.lineTo(12, -5);
    context.closePath();

    context.fillStyle = "#8c78d8";
    context.fill();

    context.beginPath();
    context.moveTo(-10, 7);
    context.lineTo(-18, 17);
    context.lineTo(5, 11);
    context.lineTo(12, 5);
    context.closePath();

    context.fillStyle = "#8c78d8";
    context.fill();

    // Cuerpo principal
    context.beginPath();
    context.moveTo(23, 0);
    context.lineTo(-10, -9);
    context.lineTo(-6, 0);
    context.lineTo(-10, 9);
    context.closePath();

    context.fillStyle = "#b8f3f0";
    context.fill();

    context.strokeStyle = "#ffffff";
    context.lineWidth = 1.5;
    context.stroke();

    // Cabina
    context.beginPath();
    context.ellipse(5, 0, 6, 3.5, 0, 0, Math.PI * 2);
    context.fillStyle = "#ffffff";
    context.fill();

    // Brillo de la cabina
    context.beginPath();
    context.arc(6, -1, 1.5, 0, Math.PI * 2);
    context.fillStyle = "#8c78d8";
    context.fill();

    context.restore();
};

// Actualizar movimiento
Navecita.prototype.update = function() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    this.showFlame = false;

    if (keys["ArrowLeft"] || keys["a"] || keys["A"]) {
        this.rotation -= 0.055;
    }

    if (keys["ArrowRight"] || keys["d"] || keys["D"]) {
        this.rotation += 0.055;
    }

    if (keys["ArrowUp"] || keys["w"] || keys["W"]) {
        this.speedX += Math.cos(this.rotation) * this.acceleration;
        this.speedY += Math.sin(this.rotation) * this.acceleration;
        this.showFlame = true;
    }

    if (keys["ArrowDown"] || keys["s"] || keys["S"]) {
        this.speedX *= 0.94;
        this.speedY *= 0.94;
    }

    // Velocidad máxima
    const speed = Math.hypot(this.speedX, this.speedY);

    if (speed > this.maxSpeed) {
        this.speedX = this.speedX / speed * this.maxSpeed;
        this.speedY = this.speedY / speed * this.maxSpeed;
    }

    // Fricción
    this.speedX *= this.friction;
    this.speedY *= this.friction;

    this.x += this.speedX;
    this.y += this.speedY;

    // Límites de pantalla
    if (this.x < 25) {
        this.x = 25;
        this.speedX = 0;
    }

    if (this.x > w - 25) {
        this.x = w - 25;
        this.speedX = 0;
    }

    if (this.y < 25) {
        this.y = 25;
        this.speedY = 0;
    }

    if (this.y > h - 25) {
        this.y = h - 25;
        this.speedY = 0;
    }
};

// Dibujar continuamente
function animate() {
    if (!paused) {
        drawBackground();
        nave.update();
        nave.draw();
    }

    requestAnimationFrame(animate);
}

// Controles del teclado
window.addEventListener("keydown", function(event) {
    if ([
        "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "
    ].includes(event.key)) {
        event.preventDefault();
    }

    keys[event.key] = true;
});

window.addEventListener("keyup", function(event) {
    keys[event.key] = false;
});

window.addEventListener("blur", function() {
    Object.keys(keys).forEach(key => {
        keys[key] = false;
    });
});

// Botón reiniciar
document.getElementById("resetButton").addEventListener("click", function() {
    nave = new Navecita();
});

// Botón pausar
document.getElementById("pauseButton").addEventListener("click", function() {
    paused = !paused;

    this.textContent = paused
        ? "▶ Continuar simulación"
        : "Ⅱ Pausar simulación";

    if (paused) {
        drawBackground();
        nave.draw();
    }
});

// Iniciar
resizeCanvas();
animate();

window.addEventListener("resize", resizeCanvas);
