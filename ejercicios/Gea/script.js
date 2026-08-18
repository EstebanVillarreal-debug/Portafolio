// mover asociados
document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('carrusel');
    if (!contenedor) return;

    const track = contenedor.querySelector('.carrusel-via');
    const slides = contenedor.querySelectorAll('.carrusel-mover');

    if (!track || slides.length <= 1) return;

    const intervaloMs = 10000;
    let indiceActual = 0;

    setInterval(() => {
        indiceActual = (indiceActual + 1) % slides.length;
        track.style.transform = `translateX(-${indiceActual * 100}%)`;
    }, intervaloMs);
});