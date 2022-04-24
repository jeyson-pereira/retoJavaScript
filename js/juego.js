let contenedor = document.getElementById('contenedor-trivia');

//Datos de partida
let aprobadas, ronda, puntaje;
let puntajesJugador = [];

// Cargar datos al abrir la pagina
let categorias;
let preguntasCategorias;

window.onload = async () => {
  let dataPreguntas = await jsonFetchData;
  categorias = dataPreguntas.categories;
  preguntasCategorias = dataPreguntas.questions;
};

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
  //console.log(preguntaActual)

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

// Fetch Json retorna objecto con preguntas  y categorias
const jsonFetchData = fetch("../data/preguntas.json").then(r => r.json()).then(data => {
  return data.data;
});

// Validar respuesta correcta comparada por elegida jugador
// redibuja ronda si aún sigue jugando, vuelve al menú si pierde y guarda puntaje si finalizó
const validarRespuesta = (correcta, respuestaJp) => {
  if (correcta === respuestaJp) {
    ronda++;
    puntaje += 100;

    if (ronda < 5) return continuarJugandoForm();
    return guardarJugador();
  }
  window.alert("Upsss... has perdido! \nNo te llevas ningún premio, vuelve a intentarlo...");
  return volverMenu();
}

// Continuar jugando? dibuja botones para continuar (dibuja nueva ronda) o retirar (guarda puntaje jugador)
const continuarJugandoForm = () => {
  contenedor.innerHTML = "";

  let puntajeHtml = document.createElement("p");
  puntajeHtml.className = "border border-primary rounded-pill p-2 text-primary font-weight-bold text-center";
  puntajeHtml.appendChild(document.createTextNode(`Puntaje acumulado: ${puntaje}`));

  let botonRetiro = document.createElement("button");
  botonRetiro.className = "m-2 btn btn-danger";
  botonRetiro.appendChild(document.createTextNode('Retirarme con acumulado'));
  
  botonRetiro.addEventListener("click", (e) => {
    guardarJugador();
  });
  
  let botonSeguirJugando = document.createElement("button");
  botonSeguirJugando.className = "m-2 btn btn-success";
  botonSeguirJugando.appendChild(document.createTextNode('Seguir jugando'));
  
  botonSeguirJugando.addEventListener("click", (e) => {
    dibujarRonda();
  });

  contenedor.append(puntajeHtml,botonRetiro,botonSeguirJugando);
}

// Guardar puntaje del jugador pregunta nombre para añadir al historial
const guardarJugador = () => {
  contenedor.innerHTML = "";

  let mensaje = document.createElement("p");
  mensaje.className = "text-center font-weight-bold";
  mensaje.appendChild(document.createTextNode(`Gracias por jugar, tu premio es un total de ${puntaje} puntos, ingresa tu nombre y guarda tu puntaje.`));

  let inputJugador = document.createElement("input");
  inputJugador.setAttribute("id", "jugador");
  inputJugador.className = "form-control";
  inputJugador.setAttribute("placeholder", "Ingrese nombre:");

  let botonGuardar = document.createElement("button");
  botonGuardar.setAttribute("id", "botonJugador");
  botonGuardar.innerText = "Registrar Puntaje";
  botonGuardar.className = "btn btn-primary mt-2";

  contenedor.append(mensaje, inputJugador, botonGuardar);

  botonGuardar.addEventListener("click", () => {
    let nombre = document.querySelector("#jugador").value;
    let objetoJugador = { "nombre": nombre, "puntaje": puntaje };
    puntajesJugador.push(objetoJugador);
    dibujarPuntajes();
  });
}

// Dibuja tabla con puntajes alojados en historial puntajes
const dibujarPuntajes = () => {
  document.getElementById("contenedor-menu").className = "d-none";
  contenedor.className = "d-flex flex-column";
  contenedor.innerHTML = "";

  let tablaPuntos = document.createElement("table");
  tablaPuntos.setAttribute("id", "tablaPuntos");
  contenedor.appendChild(tablaPuntos);
  tablaPuntos.className = "table table-dark table-striped";

  let celdasJugadores = "<tr><th>Nombre</th><th>Puntaje</th></tr>";

  //Ordenar puntajes jugadores de mayor a menor
  puntajesJugador.sort((a, b) => parseFloat(b.puntaje) - parseFloat(a.puntaje));

  puntajesJugador.map((jugador) => {
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

// Limpiar contenedor y mostrar nuevamente menú inicial
const volverMenu = () => {
  contenedor.innerHTML = "";
  document.getElementById("contenedor-menu").className = "d-flex flex-column";
  contenedor.className = "d-none";
}
