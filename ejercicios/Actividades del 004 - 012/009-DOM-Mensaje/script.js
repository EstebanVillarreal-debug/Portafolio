const btnEl = document.querySelector(".btn");
const inputEl = document.querySelector(".input");
const mensajeEl = document.querySelector(".mensaje");
const errorEl = document.querySelector(".error");

btnEl.addEventListener("click",displayMensaje);

function displayMensaje(){
    if(inputEl.value){
        mensajeEl.textContent = inputEl.value;
        inputEl.value = "";
    }else{
        errorEl.style.display = "block";
        setInterval(() =>{
            errorEl.style.display = "none";
        }, 10000);
    }
}