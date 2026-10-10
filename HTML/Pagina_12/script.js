// PAINT APP PERSONALIZADO - colores y herramientas

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const muestras = document.getElementById("muestras");
const botonesCategoria = document.querySelectorAll(".categoria");
const colorPersonalizado = document.getElementById("colorPersonalizado");
const botonesPluma = document.querySelectorAll("#tamanosPluma button");
const botonesBorrador = document.querySelectorAll("#tamanosBorrador button");
const activarPluma = document.getElementById("activarPluma");
const activarBorrador = document.getElementById("activarBorrador");
const borrarTodo = document.getElementById("borrarTodo");
const descargarPNG = document.getElementById("descargarPNG");
const descargarJPG = document.getElementById("descargarJPG");
const etiquetaPluma = document.getElementById("etiquetaPluma");
const etiquetaBorrador = document.getElementById("etiquetaBorrador");
const estadoActual = document.getElementById("estadoActual");

const paletas = {
  basicos: [
    ["Negro", "#000000"], ["Rojo", "#ff0000"], ["Amarillo", "#ffd400"],
    ["Verde", "#159447"], ["Azul", "#1769ff"], ["Blanco", "#ffffff"],
    ["Gris", "#808080"], ["Naranja", "#ff7a00"], ["Morado", "#8000b8"],
    ["Rosa", "#ff69b4"]
  ],
  pasteles: [
    ["Rosa pastel", "#ffd1dc"], ["Durazno", "#ffdab9"], ["Amarillo pastel", "#fff1a8"],
    ["Menta", "#b8f2d0"], ["Verde pastel", "#cdeac0"], ["Azul cielo", "#bde0fe"],
    ["Lavanda", "#dcd6f7"], ["Lila", "#e7c6ff"], ["Malva", "#f1c0e8"],
    ["Crema", "#fff4d6"], ["Turquesa pastel", "#b8f2e6"], ["Gris pastel", "#e5e5e5"]
  ],
  calidos: [
    ["Rojo tomate", "#e63946"], ["Coral", "#ff6b5e"], ["Salmón", "#fa8072"],
    ["Naranja", "#ff8500"], ["Mandarina", "#ff9f1c"], ["Oro", "#ffc300"],
    ["Mostaza", "#d4a017"], ["Rosa fuerte", "#ff477e"], ["Fucsia", "#e6007e"],
    ["Terracota", "#c65d3b"], ["Rojo vino", "#800020"], ["Cobre", "#b87333"]
  ],
  frios: [
    ["Azul marino", "#14213d"], ["Azul real", "#2455d6"], ["Azul", "#168aad"],
    ["Celeste", "#90e0ef"], ["Turquesa", "#2ec4b6"], ["Aqua", "#00b4d8"],
    ["Verde bosque", "#2d6a4f"], ["Esmeralda", "#2a9d8f"], ["Menta", "#74c69d"],
    ["Violeta", "#7048e8"], ["Índigo", "#4b4e9b"], ["Lila frío", "#b8b8ff"]
  ],
  tierra: [
    ["Chocolate", "#7b3f00"], ["Café", "#8b5e3c"], ["Caramelo", "#c68642"],
    ["Arena", "#e6ccb2"], ["Beige", "#d6c0a5"], ["Crema", "#f5ebe0"],
    ["Terracota", "#cb6843"], ["Canela", "#9c6644"], ["Oliva", "#606c38"],
    ["Verde salvia", "#a3b18a"], ["Gris cálido", "#a59e8c"], ["Marrón oscuro", "#432818"]
  ],
  vibrantes: [
    ["Magenta", "#ff00a8"], ["Neón rosa", "#ff1493"], ["Naranja vivo", "#ff5400"],
    ["Amarillo vivo", "#eeff00"], ["Lima", "#a7f432"], ["Verde neón", "#39ff14"],
    ["Verde intenso", "#00a878"], ["Cian", "#00f5ff"], ["Azul eléctrico", "#0066ff"],
    ["Violeta intenso", "#8f00ff"], ["Púrpura", "#b5179e"], ["Rojo brillante", "#ff1744"]
  ]
};

let colorActual = "#000000";
let grosorPluma = 7;
let grosorBorrador = 18;
let herramienta = "pluma";
let dibujando = false;

ctx.lineCap = "round";
ctx.lineJoin = "round";

// Pinta el fondo blanco desde el inicio para que el borrador funcione.
limpiarLienzoSinConfirmar();
mostrarPaleta("basicos");
actualizarEstado();

function mostrarPaleta(nombre) {
  muestras.innerHTML = "";
  paletas[nombre].forEach(([nombreColor, valor]) => {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "muestra-color";
    boton.style.setProperty("--tono", valor);
    boton.title = nombreColor;
    boton.setAttribute("aria-label", nombreColor);
    boton.addEventListener("click", () => {
      colorActual = valor;
      colorPersonalizado.value = valor;
      herramienta = "pluma";
      actualizarSeleccionColor(boton);
      actualizarBotonesHerramienta();
      actualizarEstado();
    });
    muestras.appendChild(boton);
  });
  actualizarSeleccionColorPorValor(colorActual);
}

function actualizarSeleccionColor(botonSeleccionado) {
  muestras.querySelectorAll(".muestra-color").forEach(b => b.classList.remove("activa"));
  if (botonSeleccionado) botonSeleccionado.classList.add("activa");
}

function actualizarSeleccionColorPorValor(valor) {
  const boton = [...muestras.querySelectorAll(".muestra-color")]
    .find(b => b.style.getPropertyValue("--tono").trim() === valor);
  actualizarSeleccionColor(boton);
}

botonesCategoria.forEach(boton => {
  boton.addEventListener("click", () => {
    botonesCategoria.forEach(b => b.classList.remove("activa"));
    boton.classList.add("activa");
    mostrarPaleta(boton.dataset.grupo);
  });
});

colorPersonalizado.addEventListener("input", () => {
  colorActual = colorPersonalizado.value;
  herramienta = "pluma";
  actualizarSeleccionColorPorValor(colorActual);
  actualizarBotonesHerramienta();
  actualizarEstado();
});

botonesPluma.forEach(boton => {
  boton.addEventListener("click", () => {
    grosorPluma = Number(boton.dataset.size);
    marcarActivo(botonesPluma, boton);
    herramienta = "pluma";
    actualizarBotonesHerramienta();
    actualizarEstado();
  });
});

botonesBorrador.forEach(boton => {
  boton.addEventListener("click", () => {
    grosorBorrador = Number(boton.dataset.size);
    marcarActivo(botonesBorrador, boton);
    herramienta = "borrador";
    actualizarBotonesHerramienta();
    actualizarEstado();
  });
});

activarPluma.addEventListener("click", () => {
  herramienta = "pluma";
  actualizarBotonesHerramienta();
  actualizarEstado();
});

activarBorrador.addEventListener("click", () => {
  herramienta = "borrador";
  actualizarBotonesHerramienta();
  actualizarEstado();
});

function marcarActivo(lista, seleccionado) {
  lista.forEach(b => b.classList.remove("activa"));
  seleccionado.classList.add("activa");
}

function actualizarBotonesHerramienta() {
  activarPluma.classList.toggle("activo", herramienta === "pluma");
  activarBorrador.classList.toggle("activo", herramienta === "borrador");
}

function actualizarEstado() {
  etiquetaPluma.textContent = `${grosorPluma} px`;
  etiquetaBorrador.textContent = `${grosorBorrador} px`;
  if (herramienta === "borrador") {
    estadoActual.textContent = `Borrador · ${grosorBorrador} px`;
    canvas.style.cursor = "cell";
  } else {
    estadoActual.textContent = `Pluma · ${colorActual.toUpperCase()} · ${grosorPluma} px`;
    canvas.style.cursor = "crosshair";
  }
}

function posicionPuntero(evento) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (evento.clientX - rect.left) * (canvas.width / rect.width),
    y: (evento.clientY - rect.top) * (canvas.height / rect.height)
  };
}

canvas.addEventListener("pointerdown", evento => {
  evento.preventDefault();
  dibujando = true;
  canvas.setPointerCapture(evento.pointerId);
  const p = posicionPuntero(evento);
  ctx.beginPath();
  ctx.moveTo(p.x, p.y);
  ctx.lineTo(p.x + 0.1, p.y + 0.1);
  aplicarHerramienta();
  ctx.stroke();
});

canvas.addEventListener("pointermove", evento => {
  if (!dibujando) return;
  evento.preventDefault();
  const p = posicionPuntero(evento);
  ctx.lineTo(p.x, p.y);
  aplicarHerramienta();
  ctx.stroke();
});

function finalizarTrazo() {
  dibujando = false;
  ctx.beginPath();
}
canvas.addEventListener("pointerup", finalizarTrazo);
canvas.addEventListener("pointercancel", finalizarTrazo);
canvas.addEventListener("lostpointercapture", finalizarTrazo);

function aplicarHerramienta() {
  if (herramienta === "borrador") {
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = grosorBorrador;
  } else {
    ctx.strokeStyle = colorActual;
    ctx.lineWidth = grosorPluma;
  }
}

// Borrar todo con confirmación.
borrarTodo.addEventListener("click", () => {
  if (window.confirm("¿Seguro que quieres borrar todo tu dibujo?")) {
    limpiarLienzoSinConfirmar();
  }
});

function limpiarLienzoSinConfirmar() {
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
  ctx.beginPath();
}

// Exportar la imagen a PNG o JPG.
descargarPNG.addEventListener("click", () => descargarImagen("png"));
descargarJPG.addEventListener("click", () => descargarImagen("jpg"));

function descargarImagen(formato) {
  const temporal = document.createElement("canvas");
  temporal.width = canvas.width;
  temporal.height = canvas.height;
  const tempCtx = temporal.getContext("2d");
  tempCtx.fillStyle = "#ffffff";
  tempCtx.fillRect(0, 0, temporal.width, temporal.height);
  tempCtx.drawImage(canvas, 0, 0);

  const tipo = formato === "jpg" ? "image/jpeg" : "image/png";
  const enlace = document.createElement("a");
  enlace.download = `mi-dibujo.${formato}`;
  enlace.href = temporal.toDataURL(tipo, 0.95);
  enlace.click();
}
