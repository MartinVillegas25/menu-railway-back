// Referencias HTML
const lblTicket1 = document.querySelector('#lblTicket1');
const lblEscritorio1 = document.querySelector('#lblEscritorio1');
const lblTicket2 = document.querySelector('#lblTicket2');
const lblEscritorio2 = document.querySelector('#lblEscritorio2');
const lblTicket3 = document.querySelector('#lblTicket3');
const lblEscritorio3 = document.querySelector('#lblEscritorio3');
const lblTicket4 = document.querySelector('#lblTicket4');
const lblEscritorio4 = document.querySelector('#lblEscritorio4');

const searchParams = new URLSearchParams(window.location.search);

const usuario = {
	email: searchParams.get('email'),
	mesa: 'Local'
};

const socket = io();

socket.on('connect', () => {
	console.log('conectado a la sala' + usuario.email);
	socket.emit('entrarChat', usuario, (resp) => {
		// console.log('Usuarios conectados', resp);
		renderizarUsuarios(resp);
	});
	// Unirse a la sala de llamar a la camarera
	socket.emit('join-room', { room: usuario.email + '-llamar-camarera' });

	// Unirse a la sala de pedir la cuenta
	socket.emit('join-room', { room: usuario.email + '-pedir-cuenta' });

	//unirse a la sala del email para el chat
	socket.emit('join-room', { room: usuario.email });
});

socket.on('disconnect', () => {
	console.log('desconectado');
});
socket.emit('join-room', { room: usuario.email });

socket.on('estado-actual', (payload) => {
	console.log('payload', payload);

	const email = searchParams.get('email');
	console.log(payload[email][0]);

	if (payload[email][0]) {
		lblTicket1.innerText = payload[email][0];
	}

	if (payload[email][1]) {
		lblTicket2.innerText = payload[email][1];
	}

	if (payload[email][2]) {
		lblTicket3.innerText = payload[email][2];
	}

	if (payload[email][3]) {
		lblTicket4.innerText = payload[email][3];
	}
});

//******************************************************************************************* */
//chat en vivo

const divUsuarios = document.querySelector('#divUsuarios');
const formEnviar = document.querySelector('#formEnviar');
const txtMensaje = document.querySelector('#txtMensaje');
const divChatbox = document.querySelector('#divChatbox');

function renderizarUsuarios(personas, email) {
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

	const adminClass = mensaje.mesa === 'Administrador' ? 'danger' : 'info';

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
                    <div class="box bg-light-${adminClass}">${
				mensaje.mensaje
		  }</div>
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
