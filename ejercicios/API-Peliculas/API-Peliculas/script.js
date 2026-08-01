let pagina = 1
const anterior = document.getElementById("anterior");
const siguiente = document.getElementById("siguiente");

siguiente.addEventListener("click", () => {
    if (pagina < 1000) {
        pagina += 1;
        cargarPeliculas();
    }
});

anterior.addEventListener("click", () => {
    if (pagina > 1) {
        pagina -= 1;
        cargarPeliculas();
    }
});

const cargarPeliculas = async () => {
    try {
        const respuesta = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=192e0b9821564f26f52949758ea3c473&language=es-MX&page=${pagina}`)

        console.log(respuesta);

        if (respuesta.status === 200) {
            const datos = await respuesta.json();

            let peliculas = '';
            datos.results.forEach(pelicula => {
                peliculas += `
                    <div class="pelicula">
                        <img class="poster" src="https://image.tmdb.org/t/p/w500/${pelicula.poster_path}">
                        <h3 class="titulo">${pelicula.title}</h3>
                    </div>
                    `;
            });

            document.getElementById("contenedor").innerHTML = peliculas;
        } else if (respuesta.status === 401) {
            console.log("Pusiste la llave mal");
        } else if (respuesta.status === 400) {
            console.log("La pelicula que buscas no existe");
        } else {
            console.log("Hubo un error y no sabemos que pasa");
        }

    } catch (error) {
        console.log(error);
    }

}

cargarPeliculas();