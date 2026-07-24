const btnreir = document.querySelector(".btn");
const text = document.querySelector(".broma");

var URL = "https://v2.jokeapi.dev/joke/Any?lang=es&type=single";

btnreir.addEventListener("click", getMethod);

async function getMethod() {
    text.classList.remove("deslizar");
    const data = await fetch(URL).then((e) => e.json());
    if (data) {
        console.log(data);
        text.innerHTML = data.joke;
        text.classList.add("deslizar");
    }
}