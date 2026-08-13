// boton hambuerguesa
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

document.querySelectorAll('.container-intereses .Intereses').forEach(item => {
    const tooltip = item.querySelector('.contenerdor-inter');

    item.addEventListener('mouseenter', () => {
        item.classList.add('mostrar-tooltip');

        // resetear ajuste previo
        tooltip.style.left = '50%';
        tooltip.style.right = 'auto';
        tooltip.style.transform = 'translateX(-50%) translateY(0)';

        const rect = tooltip.getBoundingClientRect();
        const margen = 10;

        if (rect.left < margen) {
            // se sale por la izquierda
            tooltip.style.left = '0';
            tooltip.style.transform = 'translateX(0) translateY(0)';
        } else if (rect.right > window.innerWidth - margen) {
            // se sale por la derecha
            tooltip.style.left = 'auto';
            tooltip.style.right = '0';
            tooltip.style.transform = 'translateX(0) translateY(0)';
        }
    });

    item.addEventListener('mouseleave', () => {
        item.classList.remove('mostrar-tooltip');
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
    enlace.href = "documentos/HojadeVidaEstebanVillarreal.pdf";
    enlace.download = "HV-Esteban-Villarreal.pdf";
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

//  para el ver más
document.querySelectorAll('.curriculum .item .ver-mas').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.closest('.item');
        item.classList.toggle('expandido');
        btn.textContent = item.classList.contains('expandido') ? 'Ver menos' : 'Ver más';
    });
});

// para los meteoros
document.addEventListener("DOMContentLoaded", function () {
    const inicio = document.querySelector("#inicio");
    const contenedorMeteoros = document.querySelector("#inicio > .meteoro");
    if (!inicio || !contenedorMeteoros) {
        return;
    }
    // cantidad de meteoros
    const cantidadMeteoros = 4;

    // Dividimos la pantalla en zonas.
    const zonas = [
        { min: 0, max: 12 },
        { min: 12, max: 25 },
        { min: 25, max: 38 },
        { min: 38, max: 50 },
        { min: 50, max: 62 },
        { min: 62, max: 75 },
        { min: 75, max: 88 },
        { min: 88, max: 100 }
    ];

    // mezclar las zonas
    zonas.sort(() => Math.random() - 0.5);
    for (let i = 0; i < cantidadMeteoros; i++) {
        const estrella = document.createElement("span");
        estrella.classList.add("estrella-fugaz");

        // horizontal
        const zona = zonas[i % zonas.length];
        const posicionX =
            zona.min +
            Math.random() * (zona.max - zona.min);
        estrella.style.left = posicionX + "%";

        //  posisicion vertical
        const posicionY =
            Math.random() * 80 - 20;
        estrella.style.top = posicionY + "%";

        //  velocidad
        const velocidad =
            Math.random() * 0.8 + 1.5;
        estrella.style.animationDuration =
            velocidad + "s";

            //  demora de aparecer
        estrella.style.animationDelay =
            (Math.random() * 8) + "s";

            //  tamaño
        const tamaño =
            Math.random() * 2 + 4;
        estrella.style.width =
            tamaño + "px";
        estrella.style.height =
            tamaño + "px";

        // agregar estrella 
        contenedorMeteoros.appendChild(estrella);
    }
});

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
