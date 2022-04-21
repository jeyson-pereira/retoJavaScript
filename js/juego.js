let cabezal = document.querySelector(".puntaje"),
  categoria = document.querySelector("#categoria"),
  preguntaHtml = document.querySelector("#pregunta"),
  respuestasHtml = document.querySelector("#respuestas"),
  opciones = respuestas.children;

let preguntasData;
let categoriasData;

const fetchData = async () => {
   let data = await fetch("/data/preguntas.json")
  .then((res) => res.json())
  .then((json) => {
      return json.data;
  })

  preguntasData = await data.questions;
  categoriasData = await data.categories;
}

const initGame = async () => {
    await fetchData();

    console.log(preguntasData, categoriasData)

}   

initGame();
