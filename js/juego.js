let cabezal = document.querySelector(".puntaje"),
  categoria = document.querySelector("#categoria"),
  preguntaHtml = document.querySelector("#pregunta"),
  puntajeHtml = document.querySelector(".puntaje");
  contenedor = document.querySelector(".contenedor-respuestas"),
  
  respuestasHtml = document.querySelector("#respuestas"),
  opciones = respuestasHtml.children;

let preguntasData;
let categoriasData;
let ronda = 0;
let puntaje= 100;

let botonOpciones = document.createElement('button')
botonOpciones.className = "botonOpciones"


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
  contenedor.appendChild(preguntaHtml)
  respuestasHtml.appendChild(botonOpciones)
  let categoriaSeleccionada = categoriaAlAzar(aprobadas, categoriasData.length);
  aprobadas.push(categoriaSeleccionada);
  categoria.innerHTML = categoriasData[categoriaSeleccionada];
  mostrarPreguntaCategoria(categoriaSeleccionada);
}

function mostrarPreguntaCategoria(catIndex) {
  let preguntaSeleccionada = preguntasData[catIndex][ronda];
  preguntaHtml.innerHTML = preguntaSeleccionada.question;
  for(let index = 0; index < preguntaSeleccionada.choices.length; index++ ){
      opciones[index].innerHTML = preguntaSeleccionada.choices[index];
      opciones[index].addEventListener("click", (e)=>{
        let correctaJugador = e.target.textContent;
        validarRespuesta(preguntaSeleccionada.choices[preguntaSeleccionada.answer], correctaJugador)
      })
  } 
}

function validarRespuesta(correcta, respuestaJp){
  if(correcta === respuestaJp){
    ronda++
    puntaje =+100;
    console.log(`ronda: ${ronda}`);
    if(ronda <5){
      remueve();
      mostrarCategoria();
    } else{
      window.location.replace('/fin.html')
    }
  }
}

function remueve(){
  const hijos = document.querySelectorAll('#respuestas > *');
  for ( let c of hijos){
    c.remove();
  }
}


initGame();
