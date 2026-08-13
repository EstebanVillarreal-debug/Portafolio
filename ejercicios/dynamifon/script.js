// la IA está potente
const clock = document.getElementById("clock");
const date = document.getElementById("date");
const colorCircle = document.getElementById("colorCircle");
const rgbText = document.getElementById("rgbText");

const dias = [
    "domingo",
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado"
];

const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre"
];

function hsvToRgb(h, s, v) {
    let r;
    let g;
    let b;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0:
            r = v;
            g = t;
            b = p;
            break;
        case 1:
            r = q;
            g = v;
            b = p;
            break;
        case 2:
            r = p;
            g = v;
            b = t;
            break;
        case 3:
            r = p;
            g = q;
            b = v;
            break;
        case 4:
            r = t;
            g = p;
            b = v;
            break;
        case 5:
            r = v;
            g = p;
            b = q;
            break;
    }


    return [
        Math.round(r * 255),
        Math.round(g * 255),
        Math.round(b * 255)
    ];
}

function obtenerColorSegunTiempo() {
    const ahora = new Date();
    const cicloSegundos = 10 * 60;
    const segundosTotales =
        ahora.getHours() * 3600 +
        ahora.getMinutes() * 60 +
        ahora.getSeconds();
    const posicion =
        (segundosTotales % cicloSegundos)
        / cicloSegundos;
    return hsvToRgb(
        posicion,
        1,
        1
    );
}

function actualizarReloj() {
    const ahora = new Date();
    let horas = String(
        ahora.getHours()
    ).padStart(2, "0");
    let minutos = String(
        ahora.getMinutes()
    ).padStart(2, "0");
    clock.textContent =
        `${horas}:${minutos}`;
    const nombreDia =
        dias[ahora.getDay()];
    const numeroDia =
        String(ahora.getDate())
            .padStart(2, "0");
    const nombreMes =
        meses[ahora.getMonth()];
    date.textContent =
        `${nombreDia}, ${numeroDia} de ${nombreMes}`;
    const [r, g, b] =
        obtenerColorSegunTiempo();
    const color =
        `rgb(${r}, ${g}, ${b})`;
    document.documentElement.style
        .setProperty(
            "--dynamic-color",
            color
        );
    rgbText.textContent =
        `RGB(${r}, ${g}, ${b})`;
    colorCircle.style.background =
        color;
    colorCircle.style.boxShadow =
        `0 0 10px ${color}`;
}

actualizarReloj();

setInterval(
    actualizarReloj,
    1000
);