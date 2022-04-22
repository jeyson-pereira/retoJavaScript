import puntajesJugador from "./historial.js";

let cabezal = document.querySelector(".puntaje"),
  categoria = document.querySelector("#categoria"),
  preguntaHtml = document.querySelector("#pregunta"),
  puntajeHtml = document.querySelector(".puntaje"),
  contenedor = document.querySelector(".contenedor-respuestas"),
  respuestasHtml = document.querySelector("#respuestas"),
  contedorHtml = document.querySelector(".contenedor"),
  opciones = respuestasHtml.children;
let botonIniciar = document.querySelector(".iniciar");
let preguntasData;
let categoriasData;
let ronda = 0;
let puntaje = 0;

let aprobadas = [];

const fetchData = async () => {
  let data = await fetch("/data/preguntas.json")
    .then((res) => res.json())
    .then((json) => {
      return json.data;
    });

  preguntasData = await data.questions;
  categoriasData = await data.categories;
};

const categoriaAlAzar = (aprobadas, maxCategoria) => {
  let randnr;
  // ? Validate if this categorie is succeded
  do {
    randnr = Math.floor(Math.random() * maxCategoria);
  } while (aprobadas.includes(randnr));

  return randnr;
};

const initGame = async () => {
  await fetchData();
  mostrarCategoria();
};


function mostrarCategoria() {
  contenedor.insertBefore(preguntaHtml, preguntaHtml);
  let categoriaSeleccionada = categoriaAlAzar(aprobadas, categoriasData.length);
  aprobadas.push(categoriaSeleccionada);
  categoria.innerHTML = `Categoria: ${categoriasData[categoriaSeleccionada]}`;
  mostrarPreguntaCategoria(categoriaSeleccionada);
}

function mostrarPreguntaCategoria(catIndex) {
  let preguntaSeleccionada = preguntasData[catIndex][ronda];
  preguntaHtml.innerHTML = preguntaSeleccionada.question;
  for (let index = 0; index < preguntaSeleccionada.choices.length; index++) {
    let botonOpciones = document.createElement("button");
    botonOpciones.className = "m-2 btn btn-primary";
    respuestasHtml.appendChild(botonOpciones);
    opciones[index].innerHTML = preguntaSeleccionada.choices[index];
    opciones[index].addEventListener("click", (e) => {
      let correctaJugador = e.target.textContent;
      validarRespuesta(
        preguntaSeleccionada.choices[preguntaSeleccionada.answer],
        correctaJugador
      );
    });
  }
}

function validarRespuesta(correcta, respuestaJp) {
  if (correcta === respuestaJp) {
    ronda++;
    puntaje += 100;
    puntajeHtml.innerHTML = puntaje;
    console.log(puntaje);
    console.log(`ronda: ${ronda}`);
    if (ronda < 5) {
      remueve();
      mostrarCategoria();
    } else {
      remueve();
      remueveContenedor();
      crearJugador();
    }
  } else {
    remueve();
    remueveContenedor();
    crearJugador();
  }
}

function crearJugador() {
  let jugador = document.createElement("input");
  let botonJugador = document.createElement("button");
  botonJugador.setAttribute("id", "botonJugador");
  botonJugador.innerText = "Registrar Puntaje";
  jugador.setAttribute("id", "jugador");
  contedorHtml.appendChild(jugador);
  contedorHtml.appendChild(botonJugador);
  botonJugador.addEventListener("click", () => {
    let nombreJugador = document.querySelector("#jugador").value;
    let objetoJugador = {
      nombre: nombreJugador,
      puntaje: puntaje,
    };
    puntajesJugador.push(objetoJugador);
    let mostrarJugador = document.createElement("h3");
    let mostrarPuntaje = document.createElement("h3");
    mostrarJugador.innerText = `Jugador: ${objetoJugador.nombre}`;
    mostrarPuntaje.innerText = `Puntaje: ${objetoJugador.puntaje}`;
    contedorHtml.append(mostrarJugador, mostrarPuntaje);
  });
}

// const mostrarTablaJugadores = document.

function remueve() {
  const hijos = document.querySelectorAll("#respuestas > *");
  for (let c of hijos) {
    c.remove();
  }
}

function remueveContenedor() {
  const hijos = document.querySelectorAll(
    "div .categoria",
    "div .contenedor-respuesta"
  );
  categoria.remove();
  contenedor.remove();
}


initGame();