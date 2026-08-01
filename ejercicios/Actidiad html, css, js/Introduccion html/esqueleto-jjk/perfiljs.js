const botonContratar = document.getElementById("btn-contratar");
function darGracias() {
    botonContratar.innerText = "¡Gracias por la oportunidad!";
    alert("¡Me pondré en contacto muy pronto! 🚀");
}
botonContratar.addEventListener("click", darGracias);