const TicketControl = require('../models/ticket-control');
const { Usuarios } = require('../models/usuarios');
const { crearMensaje } = require('../utilidades/utilidades');

const usuarios = new Usuarios();
const ticketControl = new TicketControl();

const socketController = (socket, io) => {
	socket.on('connect', ({ room }) => {
		socket.to(room).emit('estado-actual', ticketControl.ultimos4);
		socket.emit('tickets-pendientes', ticketControl.mesas.length);
		socket.to(room).emit('tickets-pendientes', ticketControl.mesas.length);
	});

	socket.on('join-room', ({ room }) => {
		socket.join(room); // Unir el socket a la sala especificada
		console.log('sala', room);
	});

	//socket llamar camarera

	socket.on('llamar-camarera', (usuario, callback) => {
		const salaLlamarCamarera = usuario.email + '-llamar-camarera';

		// Unir el socket a la sala correspondiente
		socket.join(salaLlamarCamarera);

		console.log('Usuario llamar camarera', usuario);
		const siguiente = ticketControl.siguiente(usuario.mesa, usuario.email);
		callback(siguiente);

		if (!usuario.mesa) {
			return callback({
				ok: false,
				msg: 'La mesa es obligatoria'
			});
		}

		const ticket = ticketControl.llamarCamerera(usuario.email, usuario.mesa);
		console.log('ticket de ticket control', ticket);

		socket.to(salaLlamarCamarera).emit('estado-actual', ticketControl.ultimos4);
		socket.emit('tickets-pendientes', ticketControl.mesas.length);
		socket
			.to(salaLlamarCamarera)
			.emit('tickets-pendientes', ticketControl.mesas.length);

		if (!ticket) {
			callback({
				ok: false,
				msg: 'No hay Alertas pendientes'
			});
		} else {
			callback({
				ok: true,
				ticket
			});
		}
	});
	//socket pedit cuenta

	socket.on('pedir-cuenta', (usuario, data, callback) => {
		const salaPedirCuenta = usuario.email + '-pedir-cuenta';

		// Unir el socket a la sala correspondiente
		socket.join(salaPedirCuenta);

		const { nombre, metodo } = data;
		console.log({ nombre, metodo });

		const respuesta = ticketControl.guardarPedirCuenta(
			usuario.email,
			usuario.mesa,
			nombre,
			metodo
		);
		callback(respuesta);

		const ticket = ticketControl.pedirCuenta(
			usuario.mesa,
			nombre,
			usuario.email,
			metodo
		);
		console.log('ticket de ticket control', ticket);

		socket.to(salaPedirCuenta).emit('estado-actual', ticketControl.ultimos4);
		socket.emit('tickets-pendientes', ticketControl.mesas.length);
		socket
			.to(salaPedirCuenta)
			.emit('tickets-pendientes', ticketControl.mesas.length);
	});

	// chat por restaurant

	// 	socket.on('entrarChat', (data, callback) => {
	// 		console.log('data', data);

	// 		if (!data.mesa || !data.email) {
	// 			return callback({
	// 				error: true,
	// 				mensaje: 'El nombre/sala es necesario'
	// 			});
	// 		}

	// 		socket.join(data.email);

	// 		usuarios.agregarPersona(socket.id, data.mesa, data.email);

	// 		socket
	// 			.to(data.email)
	// 			.emit('listaPersona', usuarios.getPersonasPorSala(data.email));

	// 		callback(usuarios.getPersonasPorSala(data.email));
	// 	});

	// 	socket.on('crearMensaje', (data, callback) => {
	// 		let persona = usuarios.getPersona(socket.id);

	// 		let mensaje = crearMensaje(persona.mesa, data.mensaje);
	// 		socket.to(persona.email).emit('crearMensaje', mensaje);

	// 		callback(mensaje);
	// 	});

	// 	socket.on('disconnect', () => {
	// 		let personaBorrada = usuarios.borrarPersona(socket.id);

	// 		socket
	// 			.to(personaBorrada.email)
	// 			.emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.email));
	// 	});

	// 	// Mensajes privados
	// 	socket.on('mensajePrivado', (data) => {
	// 		let persona = usuarios.getPersona(socket.id);
	// 		socket
	// 			.to(data.para)
	// 			.emit('mensajePrivado', crearMensaje(persona.mesa, data.mensaje));
	// 	});
};

module.exports = {
	socketController
};
