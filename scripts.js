const titulo = document.querySelector(".titulo");
const contadorHTML = document.querySelector(".contador");

class Jugadores{
	constructor(nombre, jugador){
		this.nombre = nombre;
		this.jugador = document.querySelector(`.j${jugador}`);
		this.score = 0;
	}
	aumentarScore(){
		this.score = this.score + 10;
		console.log(`la puntuación de ${this.nombre} es de: ${this.score}.`);
		this.jugador.innerHTML = `${this.score} puntos`
		const animacion = this.jugador.animate([
			{transform: "scale(1.0)"},
			{transform: "scale(1.05)"},
			{transform: "scale(1.0)"}
			],{
			easing: "ease-in-out",
			iterations: 1,
			duration: 200
			}
		);
		return animacion.finished;
	}
	mostrarGanador(){
		titulo.innerHTML = `El ganador es ${this.nombre} con ${this.score} puntos.`;
		this.jugador.style.animationDuration = "2s"
		console.log(`El ganador es ${this.nombre} con ${this.score} puntos.`)
	}
}

class Jugador extends Jugadores{
	constructor(nombre, jugador, controles){
		super(nombre, jugador);
		this.controles = controles;
	}
}

class Ia extends Jugadores{
	constructor(nombre, jugador){
		super(nombre, jugador);
		this.nivel = [];
	}
	mostrarDificultad(){
		if(document.querySelector(".dificultad").value == "facil"){
			this.nivel = [15, 155]
		}
		else if(document.querySelector(".dificultad").value == "normal"){
			this.nivel = [10, 95]
		}
		else if(document.querySelector(".dificultad").value == "dificil"){
			this.nivel = [5, 60]
		}
	}
}

const jugador1 = new Jugador("el jugador 1", 1, ["a","s","d"]);
const jugador2 = new Jugador("el jugador 2", 2, ["1","2","3"]);
const ia = new Ia("la I.A.", 2)

const iniciador = 5;
let contador = iniciador;
let tiempo = 5;

let iniciarContador;
let iniciarContadorIA;

window.addEventListener("click", (e)=>{
	const eleccion = e.target;
	if(eleccion.className == "jugar" && contador == iniciador){
		return activarContador();
	}
	else if(eleccion.classList.contains("info")){
		return abrirInfo();
	}
	else if(eleccion.className == "alerta" || eleccion.classList.contains("cerrar_modal")){
		return cerrarInfo();
	}
	else if(contador == 0){
		if(eleccion.classList.contains("j1")){
			jugador1.aumentarScore();
		}
		else if((eleccion.classList.contains("j2")) && (document.querySelector(".rival").value == "j2")){
			jugador2.aumentarScore();
		}
	}
})

window.addEventListener("keypress", (e)=>{
	const eleccion = e.key;
	if (contador == 0) {
		jugador1.controles.forEach(tecla=>{
			if(eleccion === tecla){
				jugador1.aumentarScore();
			}
		})
		jugador2.controles.forEach(tecla=>{
			if((eleccion === tecla) && (document.querySelector(".rival").value == "j2")){
				jugador2.aumentarScore();
			}
		})
	}
})

window.addEventListener("change", (e)=>{
	const eleccion = e.target;
	if(eleccion.value == "j2"){
		document.querySelector(".dificultad").style.display = "none";
	}
	else{
		document.querySelector(".dificultad").style.removeProperty("display")
	}
})

// CONTADOR

function activarContador(){
	jugador1.jugador.style.removeProperty("animation-duration");
	jugador2.jugador.style.removeProperty("animation-duration");
	ia.jugador.style.removeProperty("animation-duration");
	jugador1.jugador.innerHTML = "0 puntos";
	jugador2.jugador.innerHTML = "0 puntos";
	ia.jugador.innerHTML = "0 puntos";
	titulo.innerHTML = `Presiona varias veces para ganar!`;
	contadorHTML.innerHTML = "VS";
	console.clear();
	iniciarContador = setInterval(mantenerContador, 1000)
}

function mantenerContador(){
	contador--
	if(contador <= 3 && contador > 0){
		contadorHTML.innerHTML = contador;
		console.log(contador)
	}
	else if(contador == 0){
		contadorHTML.innerHTML = "GO!!!";
		console.log("GO!!!")
		return detenerContador()
	}
}

function detenerContador(){
	clearInterval(iniciarContador)
	return iniciarJuego()
}

// JUEGO

function iniciarJuego(){

	setTimeout(()=>{

		if(document.querySelector(".rival").value == "j2"){
			if (jugador1.score > jugador2.score){
				jugador1.mostrarGanador();
			}
			else if(jugador2.score > jugador1.score){
				jugador2.mostrarGanador();
			}
			else{
				titulo.innerHTML = `Empate!`;
				console.log(`Empate!`)
			}
		}
		else if(document.querySelector(".rival").value == "ia"){
			if (jugador1.score > ia.score){
				jugador1.mostrarGanador();
			}
			else if(ia.score > jugador1.score){
				ia.mostrarGanador();
			}
			else{
				titulo.innerHTML = `Empate!`;
				console.log(`Empate!`)
			}
		}

		jugador1.score = 0;
		jugador2.score = 0;
		ia.score = 0;
		contador = iniciador

	}, tiempo * 1000)

	if(document.querySelector(".rival").value == "ia"){
		return activarContadorIA();
	}
}

// I.A.

function activarContadorIA(){
	ia.mostrarDificultad()
	iniciarContadorIA = setInterval(mantenerContadorIA, (Math.random() * ia.nivel[0]) + ia.nivel[1]);
	return detenerContadorIA()
}

function mantenerContadorIA(){
	ia.aumentarScore();
}

function detenerContadorIA(){
	setTimeout(()=>{
		clearInterval(iniciarContadorIA)
	}, tiempo * 1000)
}

// MODAL

function abrirInfo(){
	document.querySelector(".alerta").style.display = "flex"
}

function cerrarInfo(){
	document.querySelector(".alerta").style.display = "none"
}