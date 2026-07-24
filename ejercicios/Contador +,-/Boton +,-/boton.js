const btnIncre = document.querySelector(".inc");
const btnDismi = document.querySelector(".dis");
const btnReset = document.querySelector(".reset");
const botones = document.querySelector(".btn");
const contar = document.querySelector(".contar");

let counts = 0;

btnIncre.addEventListener("click", incrementar);
btnDismi.addEventListener("click", disminuir);
btnReset.addEventListener("click", reset);

function incrementar(){
    counts++;
    contar.innerHTML = counts;
    if(counts > 0){
        contar.style.color = "green";
    }
    if(counts == 0){
        contar.style.color = "black";
    }
}

function disminuir(){
    counts--;
    contar.innerHTML = counts;
    if(counts < 0){
        contar.style.color = "red";
    }
    if(counts == 0){
        contar.style.color = "black";
    }
}

function reset(){
    counts = 0;
    contar.innerHTML = counts;
        contar.style.color = "black";
}