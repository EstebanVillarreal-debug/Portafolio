const btnColor = document.querySelector(".btn");
const bodyColor = document.querySelector("body");

const colores = ["green", "blue", "red", "orange", "yellow", "violet", "black", "grey"]
let count = 0;

bodyColor.style.background = "black";
btnColor.addEventListener("click", cambiarColor)

function cambiarColor(){
    const color = parseInt(Math.random()*colores.length);
    bodyColor.style.background = colores[color];
    count++;
}