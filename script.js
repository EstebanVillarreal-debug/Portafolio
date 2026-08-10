let menuvisible = false;
function mostrarocultarmenu() {
    if (menuvisible) {
        document.getElementById("nav").classList = "";
        menuvisible = false;
    } else {
        document.getElementById("nav").classList = "responsive";
        menuvisible = true;
    }
}

function seleccionar() {
    document.getElementById("nav").classList = "";
    menuvisible = false;
}

// al darle a un interés se alterna la clase "activo" y se cierran cuando le dan a otro.
document.querySelectorAll(".Intereses").forEach((interes) => {
    interes.addEventListener("click", () => {
        document.querySelectorAll(".Intereses").forEach((otro) => {
            if (otro !== interes) otro.classList.remove("activo");
        });
        interes.classList.toggle("activo");
    });
});

// Busca el formulario y el espacio donde mostraré la confirmación.
const formularioContacto = document.getElementById("form-contacto");
const mensajeEnvio = document.getElementById("mensaje-envio");
let temporizadorMensajeEnvio;

if (formularioContacto && mensajeEnvio) {
    // Escucha el envío para controlar lo que ocurre al presionar el botón.
    formularioContacto.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const campos = formularioContacto.querySelectorAll("input, textarea");
        // Recorre cada campo con every para confirmar que ninguno esté vacío y que cumpla sus validaciones.
        const estanCompletos = [...campos].every((campo) => campo.value.trim() !== "" && campo.checkValidity());

        // Verifica que todos los campos estén completos y sean válidos.
        if (!estanCompletos) {
            formularioContacto.reportValidity();
            return;
        }

        mensajeEnvio.textContent = "¡El mensaje se envió correctamente!";
        mensajeEnvio.classList.add("mostrar");
        formularioContacto.reset();

        // Reinicia el tiempo y oculta el mensaje después de seis segundos.
        clearTimeout(temporizadorMensajeEnvio);
        temporizadorMensajeEnvio = setTimeout(() => {
            mensajeEnvio.classList.remove("mostrar");
            mensajeEnvio.textContent = "";
        }, 6000);
    });
}

// para la hoja de vida
function descargarCV() {
    const enlace = document.createElement("a");
    enlace.href = "../Portafolio-master/documentos/Hoja de Vida Esteban Villarreal.pdf";
    enlace.download = "CV-Esteban-Villarreal.pdf";
    enlace.click();
}

// para los filtros

const botonesFiltro = document.querySelectorAll(".filtro-btn");
const proyectosGaleria = document.querySelectorAll(".portafolio .proyecto");
const encabezadosSeccion = document.querySelectorAll(".portafolio .nomolestes");
const contadorProyectos = document.querySelector(".contador-proyectos");

function aplicarFiltro(categoria) {
    let visibles = 0;

    proyectosGaleria.forEach((proyecto) => {
        const coincide = categoria === "todos" || proyecto.dataset.categoria === categoria;
        proyecto.classList.toggle("oculto", !coincide);
        if (coincide) visibles++;
    });

    encabezadosSeccion.forEach((encabezado) => {
        const esDeEstaSeccion = categoria === "todos" || encabezado.dataset.seccion === categoria;
        encabezado.classList.toggle("oculto", !esDeEstaSeccion);
    });

    if (contadorProyectos) {
        contadorProyectos.textContent = `${visibles} proyecto${visibles === 1 ? "" : "s"}`;
    }
}

botonesFiltro.forEach((boton) => {
    boton.addEventListener("click", () => {
        botonesFiltro.forEach((b) => b.classList.remove("activo"));
        boton.classList.add("activo");
        aplicarFiltro(boton.dataset.filtro);
    });
});

aplicarFiltro("todos");

// para los skills
function efectobarra() {
    var skills = document.getElementById("skills");
    var distancia_skills = window.innerHeight - skills.getBoundingClientRect().top;
    if (distancia_skills >= 300) {
        let barra = document.getElementsByClassName("progreso");
        barra[0].classList.add("javascript");
        barra[1].classList.add("htmlcss");
        barra[2].classList.add("photoshop");
        barra[3].classList.add("wordpress");
        barra[4].classList.add("react");
        barra[5].classList.add("comunicacion");
        barra[6].classList.add("equipo");
        barra[7].classList.add("creatividad");
        barra[8].classList.add("dedicacion");
        barra[9].classList.add("proyect");
    }
}

window.onscroll = function () {
    efectobarra();
}

if (typeof ScrollReveal !== "undefined") {
    const esCelular = window.matchMedia("(max-width: 700px)").matches;

    // Base del scroll
    ScrollReveal({
        distance: esCelular ? '38px' : '60px',
        duration: esCelular ? 700 : 1000,
        easing: 'cubic-bezier(0.2, 0.65, 0.3, 1)',
        reset: false,
        viewFactor: esCelular ? 0.18 : 0
    });

    // sobre mi scroll
    ScrollReveal().reveal('.sobremi h2', {
        origin: 'top'
    });

    ScrollReveal().reveal('.sobremi p', {
        origin: 'left'
    });

    ScrollReveal().reveal('.sobremi .col', {
        origin: 'right'
    });

    ScrollReveal().reveal('.Intereses', {
        origin: 'bottom',
        interval: 100
    });

    //  skills scroll

    ScrollReveal().reveal('.skills h2', {
        origin: 'top'
    });

    ScrollReveal().reveal('.skills .col', {
        origin: 'left',
        interval: 200
    });

    ScrollReveal().reveal('.skills .skill', {
        origin: 'right',
        interval: 150
    });

    // curriculum scroll
    ScrollReveal().reveal('.curriculum h2', {
        origin: 'top'
    });

    ScrollReveal().reveal('.curriculum .izquierda', {
        origin: 'left'
    });

    ScrollReveal().reveal('.curriculum .derecha', {
        origin: 'right'
    });

    ScrollReveal().reveal('.curriculum .item', {
        distance: '80px',
        interval: 200
    });

    // portafolio scroll
    ScrollReveal().reveal('.portafolio h2', {
        origin: 'top',
    });

    ScrollReveal().reveal('.portafolio p', {
        origin: 'left',
    });

    // contacto scroll
    ScrollReveal().reveal('.contacto h2', {
        origin: 'top'
    });

    ScrollReveal().reveal('.contacto .col:first-child', {
        origin: 'left'
    });

    ScrollReveal().reveal('.contacto .col:last-child', {
        origin: 'right'
    });

    ScrollReveal().reveal('.contacto form input', {
        origin: 'left',
        interval: 100
    });

    ScrollReveal().reveal('.contacto textarea', {
        origin: 'bottom'
    });

    ScrollReveal().reveal('.contacto button', {
        origin: 'bottom',
        delay: 300
    });

    // footer scroll
    ScrollReveal().reveal('footer', {
        origin: 'bottom'
    });

}
