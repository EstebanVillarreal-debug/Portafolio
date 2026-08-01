const total_preguntas = 10;
const timer = document.getElementById('tiempo');
const tiempo_juego = 60;

const container = document.querySelector(".container");
for (let i = 1; i <= total_preguntas; i++) {
    const circule = document.createElement("div");
    circule.classList.add("circle");
    circule.textContent =String.fromCharCode(i + 96);
    circule.id = String.fromCharCode(i + 96);
    container.appendChild(circule);

    const angle = ((i -1) / total_preguntas) * Math.PI * 2 - (Math.PI / 2);
    const x = Math.round(95 + 120 * Math.cos(angle));
    const y = Math.round(95 + 120 * Math.sin(angle));
    circule.style.left = `${x}px`;
    circule.style.top = `${y}px`;
}

let comenzar = document.getElementById('comenzar');
comenzar.addEventListener('click', () => {
    document.getElementById('pantalla-inicial').style.display = "none";
    document.getElementById('pantalla-juego').style.display = "block";

    iniciarContador();

    cargarPregunta();
});

let tiemprestante = tiempo_juego;
let countdown;

function iniciarContador () {
    countdown = setInterval(() => {
        tiemprestante--;
        timer.innerText = tiemprestante;
        if (tiemprestante == 0) {
            clearInterval(countdown);
            mostrarPantallaFinal();
        }
    }, 1000);
}

let preguntaActual = -1;
let estadoPreguntas = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let cantidadAcertadas = 0;

function cargarPregunta() {
    preguntaActual++;
    if (preguntaActual >= total_preguntas) {
        preguntaActual = 0;
    }
    if (estadoPreguntas.indexOf(0) >= 0){
        while (estadoPreguntas[preguntaActual] == 1) {
            preguntaActual++;
            if(preguntaActual >= total_preguntas) {
                preguntaActual = 0;
            }
        }
        document.getElementById('letra-pregu').textContent = bd_juego[preguntaActual].id;
        document.getElementById('pregunta').textContent = bd_juego[preguntaActual].pregunta;
        let letra = bd_juego[preguntaActual].id;
        // aqui tambien se agrego el toLowerCase
        document.getElementById(letra.toLowerCase()).classList.add('pregunta-actual');
    }else {
        clearInterval(countdown);
        mostrarPantallaFinal();
    }
}

let respuesta = document.getElementById('respuestas');
respuesta.addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
        if (respuesta.value == "") {
            alert("Debe ingresar una respuesta");
            return;
        }
        let respuestaIngresada = respuesta.value.toLowerCase();
        controlarRespuesta(respuestaIngresada);
    }
});

function controlarRespuesta(respuestaIngresada){
// el toLowerCase devuelve la letra en minuscula
    if (respuestaIngresada == bd_juego[preguntaActual].respuesta.toLowerCase()) {
        cantidadAcertadas++;

        estadoPreguntas[preguntaActual] = 1;

        let letra = bd_juego[preguntaActual].id;
        document.getElementById(letra.toLowerCase()).classList.remove("pregunta-actual");
        document.getElementById(letra.toLowerCase()).classList.add("bien-respondida");
    }else {
        estadoPreguntas[preguntaActual] = 1;
        let letra = bd_juego[preguntaActual].id;
        document.getElementById(letra.toLowerCase()).classList.remove('pregunta-actual');
        document.getElementById(letra.toLowerCase()).classList.add('mal-respondida');
    }

    respuesta.value = "";
    cargarPregunta();
}

// Boton pasar mejorado

let pasar = document.getElementById('pasar');
pasar.addEventListener("click", function() {
    if (preguntaActual == total_preguntas - 1) {
        clearInterval(countdown);
        mostrarPantallaFinal();
        
    } else {
        let letra = bd_juego[preguntaActual].id;
        document.getElementById(letra.toLowerCase()).classList.remove('pregunta-actual');
        document.getElementById(letra.toLowerCase()).classList.add('mal-respondida');
        cargarPregunta();
    }
});

let responder = document.getElementById('responder');
responder.addEventListener("click", function () {
    if (respuesta.value == "") {
        alert("Debe ingresar una respuesta");
        respuesta.focus();
        respuesta.value = "";
        return;
    }
    let respuestaIngresada = respuesta.value.toLowerCase();
    controlarRespuesta(respuestaIngresada);
    respuesta.focus();
});

const bd_juego = [
    {
        id: 'A',
        pregunta: "Empresa reconocida que se dedica a los servidores",
        respuesta: "amazon"
    },
    {
        id: 'B',
        pregunta: "Termino en ingles que hace referencia a una copia de seguridad",
        respuesta: "backup"
    },
    {
        id: 'C',
        pregunta: "Nombre de la memoria que almacena temporalmente los datos de la computadora",
        respuesta: "cache"
    },
    {
        id: 'D',
        pregunta: "Archivo que controla los perifericos que se conectan a la computadora",
        respuesta: "drive"
    },
    {
        id: 'E',
        pregunta: "Mezclar los datos para protegerlos como medida de seguridad, es decir convertir texto normal a texto cifrado",
        respuesta: "encriptar"
    },
    {
        id: 'F',
        pregunta: "Famosa red social creada por Mark Zuckerberg",
        respuesta: "Facebook"
    },
    {
        id: 'G',
        pregunta: "Lenguaje de programacion creada por Google",
        respuesta: "go"
    },
    {
        id: 'H',
        pregunta: "Lenguaje utilizado para estructurar las paginas web",
        respuesta: "html"
    },
    {
        id: 'I',
        pregunta: "Aspecto que presentan los programas tras su ejecucion mediante el cual ejercemos la comunicacion con estos",
        respuesta: "interfaz"
    },
    {
        id: 'J',
        pregunta: "Lenguaje de programacion usado por Minecraft",
        respuesta: "java"
    },
]

function mostrarPantallaFinal() {
    document.getElementById('acertadas').textContent = cantidadAcertadas;
    document.getElementById('puntaje').textContent = (cantidadAcertadas * 100) / total_preguntas + "% de aciertos";
    document.getElementById('pantalla-juego').style.display = "none";
    document.getElementById('pantalla-final').style.display = "block";
}

let reiniciar = document.getElementById('reiniciar');
reiniciar.addEventListener("click", function () {
    cantidadAcertadas = 0;
    preguntaActual = -1;
    tiemprestante = tiempo_juego;
    timer.innerText = tiemprestante;
    estadoPreguntas = [0,0,0,0,0,0,0,0,0,0];

    let circulo = document.getElementsByClassName('circle');
    for (i = 0; i<circulo.length; i++) {
        circulo[i].classList.remove("pregunta-actual");
        circulo[i].classList.remove("bien-respondida");
        circulo[i].classList.remove("mal-respondida");
    }
    document.getElementById('pantalla-final').style.display = "none";
    document.getElementById('pantalla-juego').style.display = "block";
    respuesta.value = "";
    respuesta.focus();
    iniciarContador();
    cargarPregunta();
});