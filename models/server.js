const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');

const { socketController } = require('../sockets/controller');

class Server {
	constructor() {
		this.app = express();
		this.port = process.env.PORT;
		this.server = require('http').createServer(this.app);
		this.io = require('socket.io')(this.server);
		this.paths = {
			main: '/'
		};
		//middlewares
		this.middelewares();

		//routers
		this.router();

		// Sockets
		this.sockets();
	}

	middelewares() {
		//directorio static
		this.app.use(express.static('public'));

		this.app.use(cors({
			origin: 'https://menu-app-git-main-franbosco.vercel.app/', 
			methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
			credentials: true
	}));
		this.app.use(morgan('dev'));

		//para obtener datos del front en json
		this.app.use(express.json());

		//subida de imagenes
		this.app.use(
			fileUpload({
				useTempFiles: true,
				tempFileDir: './uploads',
				createParentPath: true
			})
		);
	}

	router() {
		this.app.use(this.paths.main, require('../routes/routes'));
	}
	sockets() {
		this.io.on('connection', socketController);
	}
	listen() {
		this.server.listen(this.port, () => {
			console.log('listening on port', this.port);
		});
	}
}

module.exports = Server;
