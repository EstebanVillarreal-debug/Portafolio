const tituloCancion = document.querySelector('.Reproductor-musica h1');
const nombreArtista = document.querySelector('.Reproductor-musica p');

const tarjeta = document.querySelector('.tarjeta');
const cover = document.getElementById('cover');
const coverIcon = document.getElementById('cover-icon');

const progreso = document.getElementById('progreso');
const cancion = document.getElementById('cancion');

const iconoControl = document.getElementById('iconControl');
const botonReproducirPausar = document.querySelector('.controles button.boton-reproducir-pausar');

const botonAtras = document.querySelector('.controles button.atras');
const botonAdelante = document.querySelector('.controles button.siguiente');
const botonAleatorio = document.querySelector('.controles button.aleatorio');
const botonRepetir = document.querySelector('.controles button.repetir');

// Playlist (panel izquierdo)
const playlistContainer = document.getElementById('playlist-container');
const botonVaciarPlaylist = document.getElementById('playlist-vaciar');

// Biblioteca (panel derecho)
const bibliotecaContainer = document.getElementById('biblioteca-container');
const bibliotecaTitulo = document.getElementById('biblioteca-titulo');
const campoBuscar = document.getElementById('biblioteca-buscar');
const botonAgregarTodo = document.getElementById('biblioteca-agregar-todo');

let modoRepetir = false;
let canciones = []; // la playlist: las canciones que van a sonar
let indiceCancionActual = 0;
let modoAleatorio = false;

// La biblioteca guarda todas las canciones que cargas (lista plana, sin carpetas)
let biblioteca = [];
let visibles = [];
let avisoBiblioteca = '';

// Direccion temporal de la portada que se muestra, para liberarla al cambiar
let urlPortadaActual = null;

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

// Crear canciones a partir de archivos

function idArchivo(file) {
    return file.name + '|' + file.size + '|' + file.lastModified;
}

function esAudio(file) {
    return file.type.startsWith('audio/') || /\.(mp3|wav|ogg|oga|m4a|aac|flac|opus|weba)$/i.test(file.name);
}

function crearCancion(file) {
    return {
        id: idArchivo(file),
        titulo: file.name.replace(/\.[^/.]+$/, ''),
        nombre: 'Desconocido',
        fuente: URL.createObjectURL(file),
        file: file
    };
}

function estaEnPlaylist(item) {
    return canciones.some(c => c.id === item.id);
}

// Reproduccion

function cambiarCancion(nuevoIndice, reproducirAutomaticamente = true) {
    if (!hayCanciones()) {
        return;
    }

    indiceCancionActual = nuevoIndice;
    // Guarda si la nueva cancion debe arrancar sola.
    reproducirCuandoEsteLista = reproducirAutomaticamente;

    marcarCancionActiva();
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

// Funcion para cargar canciones directo a la playlist
document.getElementById('musica-input').addEventListener('change', function (e) {
    const nuevas = [];

    Array.from(e.target.files).forEach(file => {
        // si ya esta en la playlist no la repetimos
        if (canciones.some(c => c.id === idArchivo(file))) {
            return;
        }
        nuevas.push(crearCancion(file));
    });

    // permite volver a elegir los mismos archivos despues
    e.target.value = '';

    // si la playlist estaba vacia, la primera empieza a sonar sola
    agregarAPlaylist(nuevas, true);
});

cancion.addEventListener('loadedmetadata', function () {
    progreso.max = cancion.duration;
    progreso.value = cancion.currentTime;
});

cancion.addEventListener('canplay', function () {
    if (!reproducirCuandoEsteLista) {
        return;
    }

    // se apaga para no repetir dos veces la vaina
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

// Playlist

// Agrega canciones a la playlist (sin repetir papu)
function agregarAPlaylist(lista, reproducirSiEstabaVacia = false) {
    const estabaVacia = !hayCanciones();

    const ids = new Set(canciones.map(c => c.id));
    lista.forEach(item => {
        if (!ids.has(item.id)) {
            ids.add(item.id);
            canciones.push(item);
        }
    });

    actualizarplaylist();
    actualizarBiblioteca();

    // Si no habia nada, dejamos lista la primera. Si ya habia canciones no quita la actual.
    if (estabaVacia && hayCanciones()) {
        cambiarCancion(0, reproducirSiEstabaVacia);
    }
}

// Quita canciones de la playlist
function quitarCanciones(lista) {
    if (!hayCanciones()) {
        return;
    }

    const idsQuitar = new Set(lista.map(c => c.id));
    const actual = canciones[indiceCancionActual];
    const estabaSonando = !cancion.paused;

    canciones = canciones.filter(c => !idsQuitar.has(c.id));

    if (!hayCanciones()) {
        vaciarReproductor();
    } else if (!idsQuitar.has(actual.id)) {
        indiceCancionActual = canciones.findIndex(c => c.id === actual.id);
    } else {
        indiceCancionActual = Math.min(indiceCancionActual, canciones.length - 1);
        cambiarCancion(indiceCancionActual, estabaSonando);
    }

    actualizarplaylist();
    actualizarBiblioteca();
}

// Deja el reproductor como al inicio
function vaciarReproductor() {
    reproducirCuandoEsteLista = false;
    cancion.pause();
    cancion.removeAttribute('src');
    cancion.load();

    indiceCancionActual = 0;
    tituloCancion.textContent = 'Titulo';
    nombreArtista.textContent = 'Nombre';
    progreso.max = 100;
    progreso.value = 0;

    iconoControl.classList.add('bi-play-fill');
    iconoControl.classList.remove('bi-pause-fill');

    mostrarPortada(null);
}

// Marca en la playlist la cancion actual
function marcarCancionActiva() {
    const items = playlistContainer.querySelectorAll('li[data-indice]');

    items.forEach(li => {
        const esActiva = Number(li.dataset.indice) === indiceCancionActual;
        li.classList.toggle('active', esActiva);

        if (esActiva) {
            li.setAttribute('aria-current', 'true');
            hacerVisible(li);
        } else {
            li.removeAttribute('aria-current');
        }
    });
}

// Mueve el scroll de la playlist
function hacerVisible(li) {
    const arriba = li.offsetTop;
    const abajo = li.offsetTop + li.offsetHeight;

    if (arriba < playlistContainer.scrollTop) {
        playlistContainer.scrollTop = arriba - 4;
    } else if (abajo > playlistContainer.scrollTop + playlistContainer.clientHeight) {
        playlistContainer.scrollTop = abajo - playlistContainer.clientHeight + 4;
    }
}

// Actualizar playlist
function actualizarplaylist() {
    const scrollGuardado = playlistContainer.scrollTop;
    playlistContainer.innerHTML = '';
    botonVaciarPlaylist.hidden = !hayCanciones();

    if (!hayCanciones()) {
        const vacio = document.createElement('li');
        vacio.className = 'vacio';
        vacio.textContent = 'Agrega tus canciones';
        playlistContainer.appendChild(vacio);
        return;
    }

    canciones.forEach((cancionItem, index) => {
        const li = document.createElement('li');
        li.dataset.indice = index;
        li.tabIndex = 0;

        const texto = document.createElement('span');
        texto.className = 'item-texto';
        texto.textContent = `${cancionItem.titulo} - ${cancionItem.nombre}`;

        const quitar = document.createElement('button');
        quitar.type = 'button';
        quitar.className = 'item-quitar';
        quitar.setAttribute('aria-label', 'Quitar de la playlist');
        quitar.innerHTML = '<i class="bi bi-x-lg"></i>';
        quitar.addEventListener('click', function (evento) {
            // evita que el clic tambien reproduzca la cancion
            evento.stopPropagation();
            quitarCanciones([cancionItem]);
        });

        li.addEventListener('click', function () {
            cambiarCancion(index);
        });

        li.addEventListener('keydown', function (evento) {
            if (evento.target === li && (evento.key === 'Enter' || evento.key === ' ')) {
                evento.preventDefault();
                cambiarCancion(index);
            }
        });

        li.append(texto, quitar);
        playlistContainer.appendChild(li);
    });

    playlistContainer.scrollTop = scrollGuardado;
    marcarCancionActiva();
}

botonVaciarPlaylist.addEventListener('click', function () {
    quitarCanciones(canciones.slice());
});

// Biblioteca

const colador = new Intl.Collator('es', { numeric: true, sensitivity: 'base' });

// Quita acentos y mayusculas para que la busqueda la encuentre 
function normalizar(texto) {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function escaparHtml(texto) {
    return texto
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// Al abrir una carpeta se cargan todas las cancioness
document.getElementById('carpeta-input').addEventListener('change', function (e) {
    const archivos = Array.from(e.target.files).filter(esAudio);

    e.target.value = '';

    if (archivos.length === 0) {
        avisoBiblioteca = 'No encontre canciones en esa carpeta';
        actualizarBiblioteca(false);
        return;
    }

    avisoBiblioteca = '';

    const ids = new Set(biblioteca.map(c => c.id));
    archivos.forEach(file => {
        const id = idArchivo(file);
        if (ids.has(id)) {
            return;
        }
        ids.add(id);

        const item = crearCancion(file);
        item.clave = normalizar(item.titulo); 
        biblioteca.push(item);
    });

    biblioteca.sort((a, b) => colador.compare(a.titulo, b.titulo));
    actualizarBiblioteca(false);
});

// Buscar mientras escribes
campoBuscar.addEventListener('input', function () {
    actualizarBiblioteca(false);
});

// Agrega (o quita) todas las canciones que se ven ahora
botonAgregarTodo.addEventListener('click', function () {
    if (visibles.length === 0) {
        return;
    }

    const ids = new Set(canciones.map(c => c.id));

    if (visibles.every(c => ids.has(c.id))) {
        quitarCanciones(visibles.slice());
    } else {
        agregarAPlaylist(visibles.slice());
    }
});

// lo de la biblioteca la agrega o la quita de la playlist
bibliotecaContainer.addEventListener('click', function (e) {
    const boton = e.target.closest('.biblioteca-cancion');
    if (!boton) {
        return;
    }

    const item = visibles[Number(boton.dataset.i)];
    if (!item) {
        return;
    }

    if (estaEnPlaylist(item)) {
        quitarCanciones([item]);
    } else {
        agregarAPlaylist([item]);
    }
});

function actualizarBiblioteca(conservarScroll = true) {
    const scrollGuardado = conservarScroll ? bibliotecaContainer.scrollTop : 0;

    const filtro = normalizar(campoBuscar.value.trim());
    visibles = filtro ? biblioteca.filter(c => c.clave.includes(filtro)) : biblioteca;

    campoBuscar.hidden = biblioteca.length === 0;
    botonAgregarTodo.hidden = visibles.length === 0;
    bibliotecaTitulo.textContent = biblioteca.length > 0
        ? `Biblioteca (${biblioteca.length})`
        : 'Biblioteca';

    let html = avisoBiblioteca
        ? `<li class="vacio">${escaparHtml(avisoBiblioteca)}</li>`
        : '';

    if (visibles.length === 0) {
        html += biblioteca.length === 0
            ? '<li class="vacio">Abre una carpeta con tu música</li>'
            : '<li class="vacio">No hay canciones con ese nombre</li>';
        bibliotecaContainer.innerHTML = html;
        return;
    }

    const idsPlaylist = new Set(canciones.map(c => c.id));

    botonAgregarTodo.innerHTML = visibles.every(c => idsPlaylist.has(c.id))
        ? '<i class="bi bi-dash-lg"></i> Quitar'
        : '<i class="bi bi-plus-lg"></i> Todas';

    // Se arma todo el HTML de una vez: con miles de canciones es mucho mas rapido
    html += visibles.map((item, i) => {
        const elegida = idsPlaylist.has(item.id);
        return `<li><button type="button" class="biblioteca-cancion${elegida ? ' elegida' : ''}" data-i="${i}" aria-pressed="${elegida}">`
            + '<i class="bi bi-music-note"></i>'
            + `<span class="item-texto">${escaparHtml(item.titulo)}</span>`
            + `<i class="bi marca ${elegida ? 'bi-check-circle-fill' : 'bi-plus-circle'}"></i>`
            + '</button></li>';
    }).join('');

    bibliotecaContainer.innerHTML = html;
    bibliotecaContainer.scrollTop = scrollGuardado;
}

// Info de la cancion y portada (aun no sirve completamente :c)

// Muestra la portada (url) o el icono de nota musical si no hay (null) (aun no sirve :c)
function mostrarPortada(url) {
    if (urlPortadaActual) {
        URL.revokeObjectURL(urlPortadaActual);
        urlPortadaActual = null;
    }

    if (url) {
        urlPortadaActual = url;
        cover.src = url;
        cover.style.display = 'block';
        coverIcon.style.display = 'none';
        tarjeta.style.setProperty('--portada', `url("${url}")`);
    } else {
        cover.removeAttribute('src');
        cover.style.display = 'none';
        coverIcon.style.display = 'block';
        tarjeta.style.removeProperty('--portada');
    }
}

// Lee la portada que viene dentro del archivo de audio (aun no sirve :c)
function leerPortada(cancionActual) {
    try {
        jsmediatags.read(cancionActual.file, {
            onSuccess: function (tag) {
                if (canciones[indiceCancionActual] !== cancionActual) {
                    return;
                }

                const picture = tag.tags.picture;

                if (picture) {
                    const bytes = new Uint8Array(picture.data);
                    const imagen = new Blob([bytes], { type: picture.format || 'image/jpeg' });
                    mostrarPortada(URL.createObjectURL(imagen));
                } else {
                    mostrarPortada(null);
                }
            },
            onError: function (error) {
                console.log('Error leyendo tags:', error);
                if (canciones[indiceCancionActual] === cancionActual) {
                    mostrarPortada(null);
                }
            }
        });
    } catch (error) {
        console.log('No se pudo leer la portada:', error);
        mostrarPortada(null);
    }
}

// Actualiza la informacion de la cancion actual y su portada si existe (aun no sirve :c)
function actualizarInfoCancion() {
    if (!hayCanciones()) {
        return;
    }
    const cancionActual = canciones[indiceCancionActual];
    tituloCancion.textContent = cancionActual.titulo;
    nombreArtista.textContent = cancionActual.nombre;
    cancion.src = cancionActual.fuente;
    cancion.load();
    leerPortada(cancionActual);
}

// Controles

// Funcion para reproducir o pausar la cancion
botonReproducirPausar.addEventListener('click', reproducirPausar);

function reproducirPausar() {
    if (!hayCanciones()) {
        return;
    }

    if (cancion.paused) {
        reproducirCuandoEsteLista = false;
        reproducirCancion();
    } else {
        // Si pausa manualmente
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
    reproducirCuandoEsteLista = false;
    cancion.pause();
    iconoControl.classList.add('bi-play-fill');
    iconoControl.classList.remove('bi-pause-fill');
}

progreso.addEventListener('input', function () {
    cancion.currentTime = progreso.value;
});

progreso.addEventListener('change', function () {
    if (!hayCanciones()) {
        return;
    }
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

// Inicio 
actualizarplaylist();
actualizarBiblioteca();