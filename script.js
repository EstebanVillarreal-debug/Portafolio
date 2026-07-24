let menuvisible = false;
function mostrarocultarmenu(){
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

window.onscroll = function(){
    efectobarra();
}

// Base del scroll

ScrollReveal({
    distance: '60px',
    duration: 1000,
    reset: false
});

// sobre mi scroll
ScrollReveal().reveal('.sobremi h2',{
    origin:'top'
});

ScrollReveal().reveal('.sobremi p',{
    origin:'left'
});

ScrollReveal().reveal('.sobremi .col',{
    origin:'right'
});

ScrollReveal().reveal('.Intereses',{
    origin:'bottom',
    interval:100
});

//  skills scroll

ScrollReveal().reveal('.skills h2',{
    origin:'top'
});

ScrollReveal().reveal('.skills .col',{
    origin:'left',
    interval:200
});

ScrollReveal().reveal('.skills .skill',{
    origin:'right',
    interval:150
});

// curriculum scroll
ScrollReveal().reveal('.curriculum h2',{
    origin:'top'
});

ScrollReveal().reveal('.curriculum .izquierda',{
    origin:'left'
});

ScrollReveal().reveal('.curriculum .derecha',{
    origin:'right'
});

ScrollReveal().reveal('.curriculum .item',{
    distance:'80px',
    interval:200
});

// portafolio scroll
ScrollReveal().reveal('.portafolio h2',{
    origin:'top'
});

ScrollReveal().reveal('.portafolio .galeria .proyecto',{
    origin:'bottom',
    interval:150,
    scale:0.9
});

// contacto scroll
ScrollReveal().reveal('.contacto h2',{
    origin:'top'
});

ScrollReveal().reveal('.contacto .col:first-child',{
    origin:'left'
});

ScrollReveal().reveal('.contacto .col:last-child',{
    origin:'right'
});

ScrollReveal().reveal('.contacto form input',{
    origin:'left',
    interval:100
});

ScrollReveal().reveal('.contacto textarea',{
    origin:'bottom'
});

ScrollReveal().reveal('.contacto button',{
    origin:'bottom',
    delay:300
});

// footer scroll
ScrollReveal().reveal('footer',{
    origin:'bottom'
});