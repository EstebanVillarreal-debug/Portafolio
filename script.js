const nav = document.getElementById("nav");
const botonMenu = document.querySelector(".menu-toggle");

function cerrarMenu() {
    nav.classList.remove("abierto");
    botonMenu.setAttribute("aria-expanded", "false");
}

botonMenu.addEventListener("click", () => {
    const abierto = nav.classList.toggle("abierto");
    botonMenu.setAttribute("aria-expanded", String(abierto));
});

nav.querySelectorAll("a").forEach((enlace) => enlace.addEventListener("click", cerrarMenu));

window.addEventListener("resize", () => {
    if (window.innerWidth > 1040) cerrarMenu();
});


const enlacesNav = nav.querySelectorAll("a");
const secciones = [...document.querySelectorAll("main section[id]")];
let actualizando = false;

function marcarActivo() {
    actualizando = false;
    const referencia = window.scrollY + window.innerHeight * 0.35;
    let actual = secciones[0];

    secciones.forEach((seccion) => {
        if (seccion.offsetTop <= referencia) actual = seccion;
    });

    // al llegar al final de la página, queda marcada la última sección
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        actual = secciones[secciones.length - 1];
    }

    enlacesNav.forEach((enlace) => {
        enlace.classList.toggle("activo", enlace.getAttribute("href") === "#" + actual.id);
    });
}

window.addEventListener("scroll", () => {
    if (!actualizando) {
        actualizando = true;
        requestAnimationFrame(marcarActivo);
    }
}, { passive: true });

window.addEventListener("resize", marcarActivo);
marcarActivo();


const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reducirMovimiento && "IntersectionObserver" in window) {
    const elementos = document.querySelectorAll(
        ".section .section-title, .section .lead, .section .two-col > *, .section .filtros, .section .btn"
    );

    const observadorEntrada = new IntersectionObserver(
        (entradas, observador) => {
            entradas.forEach((entrada) => {
                if (!entrada.isIntersecting) return;
                entrada.target.classList.add("visible");
                observador.unobserve(entrada.target);
            });
        },
        { threshold: 0.12 }
    );

    elementos.forEach((el) => {
        el.classList.add("reveal");
        observadorEntrada.observe(el);
    });
}


const barras = document.querySelectorAll(".fill");

function llenarBarra(barra) {
    barra.style.width = barra.dataset.nivel + "%";
}

if ("IntersectionObserver" in window) {
    const observadorBarras = new IntersectionObserver(
        (entradas, observador) => {
            entradas.forEach((entrada) => {
                if (!entrada.isIntersecting) return;
                llenarBarra(entrada.target);
                observador.unobserve(entrada.target);
            });
        },
        { threshold: 0.6 }
    );
    barras.forEach((barra) => observadorBarras.observe(barra));
} else {
    barras.forEach(llenarBarra);
}


const itemsCurriculum = document.querySelectorAll(".curriculum .item, #curriculum .item");

function revisarRecorte() {
    itemsCurriculum.forEach((item) => {
        if (item.classList.contains("expandido")) return;
        const texto = item.querySelector(".texto");
        const boton = item.querySelector(".ver-mas");
        boton.hidden = texto.scrollHeight <= texto.clientHeight + 1;
    });
}

itemsCurriculum.forEach((item) => {
    const boton = item.querySelector(".ver-mas");
    boton.addEventListener("click", () => {
        item.classList.toggle("expandido");
        boton.textContent = item.classList.contains("expandido") ? "Ver menos" : "Ver más";
    });
});

window.addEventListener("load", revisarRecorte);
window.addEventListener("resize", revisarRecorte);
revisarRecorte();


document.getElementById("btn-cv").addEventListener("click", () => {
    const enlace = document.createElement("a");
    enlace.href = "documentos/HojadeVidaEstebanVillarreal.pdf";
    enlace.download = "HV-Esteban-Villarreal.pdf";
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
});


const botonesFiltro = document.querySelectorAll(".filtro-btn");
const proyectos = document.querySelectorAll("#portafolio .proyecto");
const grupos = document.querySelectorAll("#portafolio .grupo");
const contador = document.querySelector(".contador-proyectos");

function aplicarFiltro(categoria) {
    let visibles = 0;

    proyectos.forEach((proyecto) => {
        const coincide = categoria === "todos" || proyecto.dataset.categoria === categoria;
        proyecto.classList.toggle("oculto", !coincide);
        if (coincide) visibles++;
    });

    grupos.forEach((grupo) => {
        const coincide = categoria === "todos" || grupo.dataset.seccion === categoria;
        grupo.classList.toggle("oculto", !coincide);
    });

    contador.textContent = visibles + (visibles === 1 ? " proyecto" : " proyectos");
}

botonesFiltro.forEach((boton) => {
    boton.addEventListener("click", () => {
        botonesFiltro.forEach((b) => b.classList.remove("activo"));
        boton.classList.add("activo");
        aplicarFiltro(boton.dataset.filtro);
    });
});

aplicarFiltro("todos");


const mapaWrapper = document.getElementById("mapa-wrapper");
mapaWrapper.addEventListener("click", () => mapaWrapper.classList.add("activo"));


const formulario = document.getElementById("form-contacto");
const mensajeEnvio = document.getElementById("mensaje-envio");
let temporizadorMensaje;

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    if (!formulario.checkValidity()) {
        formulario.reportValidity();
        return;
    }

    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const tema = document.getElementById("tema").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();

    const cuerpo = [
        "Hola Esteban,",
        "",
        "Mi nombre es " + nombre + ".",
        "Mi correo es " + correo + ".",
        "Mi teléfono es " + telefono + ".",
        "",
        mensaje
    ].join("\n");

    window.location.href =
        "mailto:juanevr2007@gmail.com?subject=" + encodeURIComponent(tema) + "&body=" + encodeURIComponent(cuerpo);

    mensajeEnvio.textContent = "Abriendo tu aplicación de correo...";
    mensajeEnvio.classList.add("mostrar");
    formulario.reset();

    clearTimeout(temporizadorMensaje);
    temporizadorMensaje = setTimeout(() => {
        mensajeEnvio.classList.remove("mostrar");
        mensajeEnvio.textContent = "";
    }, 6000);
});


document.addEventListener("DOMContentLoaded", function () {
    const inicio = document.querySelector("#inicio");
    const contenedorMeteoros = document.querySelector("#inicio > .meteoro");
    if (!inicio || !contenedorMeteoros) {
        return;
    }

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
        estrella.style.left = (zona.min + Math.random() * (zona.max - zona.min)) + "%";

        // vertical
        estrella.style.top = (Math.random() * 80 - 20) + "%";

        // velocidad
        estrella.style.animationDuration = (Math.random() * 0.8 + 1.5) + "s";

        // demora de aparecer
        estrella.style.animationDelay = (Math.random() * 8) + "s";

        // tamaño
        const tamano = Math.random() * 2 + 4;
        estrella.style.width = tamano + "px";
        estrella.style.height = tamano + "px";

        contenedorMeteoros.appendChild(estrella);
    }
});