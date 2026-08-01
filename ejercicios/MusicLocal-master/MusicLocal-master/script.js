// Seleccion de elementos del DOM
const tituloCancion = document.querySelector('.Reproductor-musica h1');
const nombreArtista = document.querySelector('.Reproductor-musica p');

const progreso = document.getElementById('progreso');
const cancion = document.getElementById('cancion');

const iconoControl = document.getElementById('iconControl');
const botonReproducirPausar = document.querySelector('.controles button.boton-reproducir-pausar');

const botonAtras = document.querySelector('.controles button.atras');
const botonAdelante = document.querySelector('.controles button.siguiente');
const botonAleatorio = document.querySelector('.controles button.aleatorio');
const botonRepetir = document.querySelector('.controles button.repetir');

const playlistContainer = document.getElementById('playlist-container');

let modoRepetir = false;
let canciones = [];
let indiceCancionActual = 0;
let modoAleatorio = false;

// Esto evita llamar play antes de que la nueva cancion termine de cargar.
let reproducirCuandoEsteLista = false;

function hayCanciones() {
    return canciones.length > 0;
}

function obtenerIndiceAleatorioDistinto() {
    let nuevoIndice = indiceCancionActual;

    while (nuevoIndice === indiceCancionActual) {
        nuevoIndice = Math.floor(Math.random() * canciones.length);
    }

    return nuevoIndice;
}

function cambiarCancion(nuevoIndice, reproducirAutomaticamente = true) {
    if (!hayCanciones()) {
        return;
    }

    indiceCancionActual = nuevoIndice;
    // Guardamos si la nueva cancion debe arrancar sola.
    reproducirCuandoEsteLista = reproducirAutomaticamente;
    actualizarInfoCancion();
}

function reproducirSiguienteCancion() {
    if (!hayCanciones()) {
        return;
    }

    if (modoRepetir) {
        // Si repetir esta activo, no cambiamos de pista: reiniciamos la actual desde el segundo 0.
        cancion.currentTime = 0;
        reproducirCancion();
        return;
    }

    if (modoAleatorio) {
        // En aleatorio buscamos otra pista distinta para que no repita la misma.
        const siguienteIndice = canciones.length === 1
            ? indiceCancionActual
            : obtenerIndiceAleatorioDistinto();
        cambiarCancion(siguienteIndice);
        return;
    }

//Ayuda saquenme de aqui :c

    //avanzamos a la siguiente cancion de la lista.
    const siguienteIndice = (indiceCancionActual + 1) % canciones.length;
    cambiarCancion(siguienteIndice);
}

// Funcion para cambiar el fondo del reproductor
document.getElementById('fondo-input').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (evento) {
            document.body.style.backgroundImage = `url(${evento.target.result})`;
        };
        reader.readAsDataURL(file);
    }
});

// Funcion para cargar canciones personalizadas
document.getElementById('musica-input').addEventListener('change', function (e) {
    const files = Array.from(e.target.files);

    files.forEach(file => {
        const url = URL.createObjectURL(file);
        const nombreArchivo = file.name.replace(/\.[^/.]+$/, '');

        canciones.push({
            titulo: nombreArchivo,
            nombre: 'Desconocido',
            fuente: url,
            file: file
        });
    });

    actualizarplaylist();

    if (canciones.length > 0) {
        cambiarCancion(0);
    }
});

cancion.addEventListener('loadedmetadata', function () {
    progreso.max = cancion.duration;
    progreso.value = cancion.currentTime;
});

cancion.addEventListener('canplay', function () {
    // ya tiene suficiente informacion para empezar a reproducir.
    if (!reproducirCuandoEsteLista) {
        return;
    }

    // Apagamos para no reproducir play dos veces sobre la misma cancion.
    reproducirCuandoEsteLista = false;
    reproducirCancion();
});

cancion.addEventListener('timeupdate', function () {
    if (!cancion.paused) {
        progreso.value = cancion.currentTime;
    }
});

// Funcion para manejar el final de la cancion
cancion.addEventListener('ended', function () {
    // Cuando una pista termina.
    reproducirSiguienteCancion();
});

// Actualizar playlist
function actualizarplaylist() {
    playlistContainer.innerHTML = '';

    canciones.forEach((cancionItem, index) => {
        const li = document.createElement('li');
        li.textContent = `${cancionItem.titulo} - ${cancionItem.nombre}`;

        li.onclick = () => {
            cambiarCancion(index);
        };

        if (index === indiceCancionActual) {
            li.classList.add('active');
        }

        playlistContainer.appendChild(li);
    });
}

// Actualiza la informacion de la cancion actual y su portada si existe
function actualizarInfoCancion() {
    if (!hayCanciones()) {
        return;
    }

    tituloCancion.textContent = canciones[indiceCancionActual].titulo;
    nombreArtista.textContent = canciones[indiceCancionActual].nombre;

    // Cambiamos el archivo de audio actual por el de la pista seleccionada.
    cancion.src = canciones[indiceCancionActual].fuente;
    // Forzamos al elemento <audio> a recargar ese nuevo archivo.
    cancion.load();

    const cover = document.getElementById('cover');
    const coverIcon = document.getElementById('cover-icon');

    jsmediatags.read(canciones[indiceCancionActual].file, {
        onSuccess: function (tag) {
            const picture = tag.tags.picture;

            if (picture) {
                let base64String = '';
                for (let i = 0; i < picture.data.length; i++) {
                    base64String += String.fromCharCode(picture.data[i]);
                }
                const imageUri = `data:${picture.format};base64,${window.btoa(base64String)}`;
                cover.src = imageUri;
                cover.style.display = 'block';
                coverIcon.style.display = 'none';
            } else {
                cover.style.display = 'none';
                coverIcon.style.display = 'block';
            }
        },
        onError: function (error) {
            console.log('Error leyendo tags:', error);
            cover.style.display = 'none';
            coverIcon.style.display = 'block';
        }
    });

    actualizarplaylist();
}

// Funcion para reproducir o pausar la cancion
botonReproducirPausar.addEventListener('click', reproducirPausar);

function reproducirPausar() {
    if (cancion.paused) {
        // Si el usuario le dio play manualmente, ya no dependemos de esperar otra reproduccion pendiente.
        reproducirCuandoEsteLista = false;
        reproducirCancion();
    } else {
        // Si pausa manualmente, cancelamos cualquier autoplay pendiente.
        reproducirCuandoEsteLista = false;
        pausarCancion();
    }
}

// Cambia el icono del boton de reproducir/pausar
function reproducirCancion() {
    const promesaReproduccion = cancion.play();

    if (promesaReproduccion !== undefined) {
        promesaReproduccion.then(() => {
            iconoControl.classList.add('bi-pause-fill');
            iconoControl.classList.remove('bi-play-fill');
        }).catch(error => {
            console.log('No se pudo reproducir la cancion:', error);
            iconoControl.classList.add('bi-play-fill');
            iconoControl.classList.remove('bi-pause-fill');
        });
        return;
    }

    iconoControl.classList.add('bi-pause-fill');
    iconoControl.classList.remove('bi-play-fill');
}

// Cambia el icono del boton de reproducir/pausar
function pausarCancion() {
    // Tambien limpiamos la bandera aqui por seguridad si la pausa ocurre desde otro flujo.
    reproducirCuandoEsteLista = false;
    cancion.pause();
    iconoControl.classList.add('bi-play-fill');
    iconoControl.classList.remove('bi-pause-fill');
}

progreso.addEventListener('input', function () {
    cancion.currentTime = progreso.value;
});

progreso.addEventListener('change', function () {
    reproducirCancion();
});

// Cambiar a la siguiente cancion
botonAdelante.addEventListener('click', function () {
    if (!hayCanciones()) {
        return;
    }

    const siguienteIndice = (indiceCancionActual + 1) % canciones.length;
    cambiarCancion(siguienteIndice);
});

// Cambiar a la cancion anterior
botonAtras.addEventListener('click', function () {
    if (!hayCanciones()) {
        return;
    }

    const indiceAnterior = (indiceCancionActual - 1 + canciones.length) % canciones.length;
    cambiarCancion(indiceAnterior);
});

// Boton de aleatorio
botonAleatorio.addEventListener('click', function () {
    modoAleatorio = !modoAleatorio;
    botonAleatorio.classList.toggle('active');

    if (modoAleatorio && canciones.length > 0) {
        const siguienteIndice = canciones.length === 1
            ? indiceCancionActual
            : obtenerIndiceAleatorioDistinto();
        cambiarCancion(siguienteIndice);
    }
});

// Boton de repetir
botonRepetir.addEventListener('click', function () {
    modoRepetir = !modoRepetir;
    botonRepetir.classList.toggle('active');
});
