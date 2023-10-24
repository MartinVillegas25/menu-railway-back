// Referencias HTML
const lblMesa = document.querySelector('h1');
const btnAtender = document.querySelector('#llamarCamareraButton');
const pedirCuentaForm = document.querySelector('form');
const lblTicket = document.querySelector('small');
const divAlerta = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes');

const searchParams = new URLSearchParams(window.location.search);

const usuario = {
	mesa: searchParams.get('mesa'),
	email: searchParams.get('email')
};

// lblMesa.innerText = usuario.mesa;

const socket = io();

socket.on('connect', () => {
	console.log('conenctado menu');
	socket.emit('entrarChat', usuario, (resp) => {
		// console.log('Usuarios conectados', resp);
		renderizarUsuarios(resp);
	});
});

socket.on('disconnect', () => {
	console.log('disconnect');
});

btnAtender.addEventListener('click', () => {
	socket.emit('llamar-camarera', usuario, (payload) => {
		lblTicket.innerText = 'Mesa' + payload;
	});
});

const nombre = document.querySelector('#nombre');
const metodo = document.querySelector('#metodo');

pedirCuentaForm.addEventListener('submit', (e) => {
	e.preventDefault();

	const nombreValor = nombre.value;
	const metodoValor = metodo.value;

	socket.emit(
		'pedir-cuenta',
		usuario,
		{ nombre: nombreValor, metodo: metodoValor },
		(response) => {
			console.log(response);
		}
	);
});

//******************************************************************************************* */
//chat en vivo

const divUsuarios = document.querySelector('#divUsuarios');
const formEnviar = document.querySelector('#formEnviar');
const txtMensaje = document.querySelector('#txtMensaje');
const divChatbox = document.querySelector('#divChatbox');

function renderizarUsuarios(personas) {
	personas.forEach((persona) => {
		email = persona.email;
		return email;
	});

	let html = '';

	personas.forEach((persona) => {
		html += `
            <li>
                <a data-id="${persona.id}" href="javascript:void(0)">
                    <span> Mesa ${persona.mesa} <small class="text-success">online</small></span>
                </a>
            </li>
        `;
	});

	divUsuarios.innerHTML = html;
}

function renderizarMensajes(mensaje, yo) {
	const fecha = new Date(mensaje.fecha);
	const hora = `${fecha.getHours()}:${fecha.getMinutes()}`;

	let html = yo
		? `
            <li class="reverse">
                <div class="chat-content">
                    <h5>${mensaje.mesa}</h5>
                    <div class="box bg-light-inverse">${mensaje.mensaje}</div>
                </div>
                <div class="chat-time">${hora}</div>
            </li>
        `
		: `
            <li class="animated fadeIn">
                ${
									mensaje.mesa !== 'Administrador'
										? `<div class="chat-img"><img src="https://res.cloudinary.com/dj3akdhb9/image/upload/v1695696885/icons8-circundado-usuario-mujer-tipo-4-de-la-piel-48_ttarml.png" alt="user" /></div>`
										: ''
								}
                <div class="chat-content">
                    <h5>${mensaje.mesa}</h5>
                    <div class="box bg-light-info">${mensaje.mensaje}</div>
                </div>
                <div class="chat-time">${hora}</div>
            </li>
        `;

	divChatbox.insertAdjacentHTML('beforeend', html);
}

function scrollBottom() {
	const newMessage = divChatbox.querySelector('li:last-child');

	const clientHeight = divChatbox.clientHeight;
	const scrollTop = divChatbox.scrollTop;
	const scrollHeight = divChatbox.scrollHeight;
	const newMessageHeight = newMessage.clientHeight;
	const lastMessageHeight =
		(newMessage.previousElementSibling &&
			newMessage.previousElementSibling.clientHeight) ||
		0;

	if (
		clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
		scrollHeight
	) {
		divChatbox.scrollTop = scrollHeight;
	}
}

// Listeners para salas privadas, no interesa por ahora
// divUsuarios.addEventListener('click', (event) => {
//     // Buscar el elemento <a> más cercano al elemento en el que se hizo clic
//     const closestA = event.target.closest('a');

//     if (closestA) {
//         const id = closestA.dataset.id;
//         if (id) {
//             console.log(id);
//         }
//     }
// });

formEnviar.addEventListener('submit', (e) => {
	e.preventDefault();

	if (txtMensaje.value.trim().length === 0) {
		return;
	}

	socket.emit(
		'crearMensaje',
		{
			mesa: usuario.mesa,
			mensaje: txtMensaje.value
		},
		(mensaje) => {
			txtMensaje.value = '';
			txtMensaje.focus();
			renderizarMensajes(mensaje, true);
			scrollBottom();
		}
	);
});

//eventos sockets

// Escuchar información
socket.on('crearMensaje', (mensaje) => {
	// console.log('Servidor:', mensaje);
	renderizarMensajes(mensaje, false);
	scrollBottom();
});

// Escuchar cambios de usuarios
// cuando un usuario entra o sale del chat
socket.on('listaPersona', (personas) => {
	renderizarUsuarios(personas);
});

// // Mensajes privados
// socket.on('mensajePrivado', (mensaje) => {
//     console.log('Mensaje Privado:', mensaje);
// });
