
// Velocidades aceleradas de cada manecilla
const vr1 = 30; // Horas: 30 veces más rápido
const vr2 = 12; // Minutos: 12 veces más rápido
const vr3 = 6;  // Segundos: 6 veces más rápido

const hourHand = document.getElementById("hourHand");
const minuteHand = document.getElementById("minuteHand");
const secondHand = document.getElementById("secondHand");
const digitalTime = document.getElementById("digitalTime");
const tickmarks = document.getElementById("tickmarks");

// Crear las 60 marcas de la carátula.
for (let i = 0; i < 60; i++) {
  const mark = document.createElement("span");
  mark.style.transform = `rotate(${i * 6}deg)`;
  if (i % 5 === 0) {
    mark.style.width = "3px";
    mark.style.height = "14px";
    mark.style.marginLeft = "-1.5px";
    mark.style.background = "#f8dca0";
  } else {
    mark.style.marginLeft = "-1px";
  }
  tickmarks.appendChild(mark);
}

const startTime = performance.now();

function animateClock(now) {
  const elapsed = (now - startTime) / 1000;

  const secondsAngle = (elapsed * vr3 * 6) % 360;
  const minutesAngle = (elapsed * vr2 * 0.1) % 360;
  const hoursAngle = (elapsed * vr1 / 120) % 360;

  secondHand.style.transform = `rotate(${secondsAngle}deg)`;
  minuteHand.style.transform = `rotate(${minutesAngle}deg)`;
  hourHand.style.transform = `rotate(${hoursAngle}deg)`;

  const total = Math.floor(elapsed * vr3);
  const hh = String(Math.floor(total / 3600) % 24).padStart(2, "0");
  const mm = String(Math.floor(total / 60) % 60).padStart(2, "0");
  const ss = String(total % 60).padStart(2, "0");
  digitalTime.textContent = `${hh}:${mm}:${ss}`;

  requestAnimationFrame(animateClock);
}

requestAnimationFrame(animateClock);
