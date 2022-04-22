let contenedor = document.getElementById('contenedor-trivia');

//Datos de partida
let aprobadas, ronda, puntaje;
let puntajesJugador = [];

// Cargar datos al abrir la pagina
let categorias;
let preguntasCategorias;


// Iniciar Juego
const juegoNuevo = () => {
  aprobadas = [];
  ronda = 0;
  puntaje = 0;

  document.getElementById('contenedor-menu').className = 'd-none';
  contenedor.className = 'd-flex flex-column';

  dibujarRonda();
}

// Dibujar ronda en contenedor
const dibujarRonda = () => {
  contenedor.innerHTML = "";
  let categoriaSeleccionada = categorias[categoriaAlAzar()]
  aprobadas.push(categorias.indexOf(categoriaSeleccionada)); //guardar en las seleccionadas(aprobadas);


  let puntajeHtml = document.createElement("p");
  puntajeHtml.appendChild(document.createTextNode(`Puntaje actual: ${puntaje}`));

  let categoriaHtml = document.createElement("p");
  categoriaHtml.appendChild(document.createTextNode(`Categoria: ${categoriaSeleccionada}`));

  let preguntaActual = preguntasCategorias[categorias.indexOf(categoriaSeleccionada)][ronda];
  console.log(preguntaActual)

  let preguntaHtml = document.createElement("h2");
  preguntaHtml.appendChild(document.createTextNode(preguntaActual.question))

  contenedor.append(puntajeHtml, categoriaHtml, preguntaHtml);

  for (let i = 0; i < preguntaActual.choices.length; i++) {
    let botonOpciones = document.createElement("button");
    botonOpciones.className = "m-2 btn btn-primary";
    botonOpciones.appendChild(document.createTextNode(preguntaActual.choices[i]))

    contenedor.appendChild(botonOpciones);

    botonOpciones.addEventListener("click", (e) => {
      let correctaJugador = e.target.textContent;
      validarRespuesta(
        preguntaActual.choices[preguntaActual.answer],
        correctaJugador
      );
    });
  }

  if (ronda > 0 && ronda < 4) {
    let botonRetiro = document.createElement("button");
    botonRetiro.className = "m-2 btn btn-warning";
    botonRetiro.appendChild(document.createTextNode('Retirarme con acumulado'));
    contenedor.appendChild(botonRetiro);
    botonRetiro.addEventListener("click", (e) => {
      guardarJugador();
    });
  }


}

// Seleccionar categoria al azar sin repetir aprobadas
const categoriaAlAzar = () => {
  let randnr;
  // ? Validate if this categorie is succeded
  do {
    randnr = Math.floor(Math.random() * categorias.length);
  } while (aprobadas.includes(randnr));

  return randnr;
};

// Fetch Json return objecto con preguntas y categorias
const jsonFetchData = fetch("../data/preguntas.json").then(r => r.json()).then(data => {
  //console.log('in async', data);
  return data.data;
});

window.onload = async () => {
  let dataPreguntas = await jsonFetchData;
  categorias = dataPreguntas.categories;
  preguntasCategorias = dataPreguntas.questions;
};


const validarRespuesta = (correcta, respuestaJp) => {
  if (correcta === respuestaJp) {
    ronda++;
    puntaje += 100;

    if (ronda < 5) {
      dibujarRonda();
    } else {
      guardarJugador();
    }
  } else {
    volverMenu();
  }
}

const guardarJugador =() => {
  contenedor.innerHTML = "";

  let inputJugador = document.createElement("input");
  inputJugador.setAttribute("id", "jugador");
  inputJugador.className = "form-control";
  inputJugador.setAttribute("placeholder","Ingrese nombre:");

  let botonGuardar = document.createElement("button");
  botonGuardar.setAttribute("id", "botonJugador");
  botonGuardar.innerText = "Registrar Puntaje";
  botonGuardar.className = "btn btn-primary mt-2";

  contenedor.append(inputJugador, botonGuardar);

  botonGuardar.addEventListener("click", () => {
    let nombre = document.querySelector("#jugador").value;
    let objetoJugador = {"nombre": nombre, "puntaje": puntaje};
    puntajesJugador.push(objetoJugador);
    dibujarPuntajes();
  });

}

const dibujarPuntajes = () => {
  document.getElementById("contenedor-menu").className = "d-none";
  contenedor.className = "d-flex flex-column";
  contenedor.innerHTML = "";

  let tablaPuntos = document.createElement("table");
  tablaPuntos.setAttribute("id", "tablaPuntos");
  contenedor.appendChild(tablaPuntos);
  tablaPuntos.className = "table table-dark table-striped";
  
  let celdasJugadores = "<tr><th>Nombre</th><th>Puntaje</th></tr>";

  puntajesJugador.map((jugador)=>{
    celdasJugadores += `<tr><td>${jugador.nombre}</td><td>${jugador.puntaje}</td></tr>`
  });

  document.getElementById('tablaPuntos').innerHTML = celdasJugadores;

  let botonVolver = document.createElement("button");
  botonVolver.setAttribute("id", "volverMenu");
  botonVolver.innerText = "Volver al menú";
  botonVolver.className = "btn btn-primary mt-2";

  contenedor.appendChild(botonVolver);

  botonVolver.addEventListener("click", () => volverMenu());
}

const volverMenu = () => {
  contenedor.innerHTML = "";
  document.getElementById("contenedor-menu").className = "d-flex flex-column";
  contenedor.className = "d-none";
}