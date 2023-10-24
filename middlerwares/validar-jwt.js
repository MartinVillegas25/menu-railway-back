const jwt = require('jsonwebtoken');

const { response } = require('express');

// Simulando una lista negra de tokens revocados
const revokedTokens = new Set();

// Ruta para eliminar el token en el logout
const logout = (req, res) => {
	const token = req.header('x-token').split(' ')[1]; // Obtener el token del encabezado

	// Agregar el token a la lista negra
	revokedTokens.add(token);

	// Respondemos con éxito al usuario
	res.status(200).json({ message: 'Logged out successfully' });
};

const validarJWT = async (req, res = response, next) => {
	const token = req.header('x-token');

	const tokenListaNegra = req.header('x-token').split(' ')[1];

	// Verificar si el token está en la lista negra
	if (revokedTokens.has(tokenListaNegra)) {
		return res
			.status(401)
			.json({ message: 'Token revoked. Please log in again.' });
	}

	if (!token) {
		return res.status(401).redirect('/');
	}

	try {
		const { email } = jwt.verify(token, process.env.SECRETORPUBLIC_KEY);
		console.log(email);
		req.email = email;

		next();
	} catch (error) {
		console.error(error);
		res.status(401).redirect('/');
		console.error('token no valido');
	}

	console.log(token);
};

module.exports = {
	validarJWT,
	logout
};
