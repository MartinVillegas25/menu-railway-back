const { Router } = require('express');
const {
	homeGet,
	loginUsuario,
	postUsuario,
	mostrar,
	dashboardLocal,
	suspenderCuenta,
	activarCuenta,
	newPassword,
	actualizarDatos,
	mostrarUsuarioPorEstado,
	nuevosValores,
	recuperarClave,
	mostrarPlanes,
	adminGet,
	configGet,
	loginAdminGet,
	postCrearAdmin,
	gracias,
	receiveWebhook,
	confimarPago,
	mostrarUsuarioConfirmar,
	mejorarPlan,
	confimarPagoPlan,
	cambiarImagenAdmin,
	cambiarImagenLocal,
	mostrarUsuarioConfirmarPlan,
	getChatLocal,
	cancelarPlan
} = require('../controllers/routers');

const { check } = require('express-validator');

const { validarJWT, logout } = require('../middlerwares/validar-jwt');
const adminRol = require('../middlerwares/validad-roles');

//controllers y middlerwares del menu
const {
	mostrarMenu,
	actualizarMenu,
	agregarProducto,
	borrarProducto,
	mostrarCategorias,
	mostrarPedidos,
	realizarPedidos,
	crearCategoria,
	crearSubCategoria,
	mostrarsubCategorias,
	liberarPedido,
	borrarCategoria,
	borrarSubCategoria,
	mostrarsubCategoriasMenu,
	mostrarCategoriasMenu,
	mostrarPlan,
	getChatMenu
} = require('../controllers/router-menu');

const router = Router();

//rutas get
router.get('/', homeGet);
router.get('/dashboard/config', [validarJWT], configGet);
router.get('/dashboard', [validarJWT], dashboardLocal);
router.get('/admin', [validarJWT, adminRol], adminGet);

router.put('/admin/confirmar-pago', [validarJWT, adminRol], confimarPago);

//rutas despues del pago
router.get('/gracias', gracias);
// router.post("/webhook", receiveWebhook);
//mostrar usuario a confirmar
router.get('/confirmar', mostrarUsuarioConfirmar);
//mostrar usuario para confirmar plan
router.get('/confimar-plan', mostrarUsuarioConfirmarPlan);

//ruta get para crear administrador
router.get('/admin-boss', loginAdminGet);
router.post(
	'/admin-boss',
	[
		check('email', 'correo no valido').isEmail(),
		check('password', 'la clave es obligatoria').not().isEmpty()
	],
	postCrearAdmin
);
router.put('/actualizar-imagen', [validarJWT], cambiarImagenAdmin);

//confirmacion de pago nuevos plan
router.put('/admin/confirmar-plan', [validarJWT, adminRol], confimarPagoPlan);

//mostrar planes get
router.get('/planes', mostrarPlanes);

//logout

router.get('/logout', logout);

//mostrar usuarios por estado
router.post('/status', mostrarUsuarioPorEstado);

//rutas post
router.post(
	'/login',
	[
		check('email', 'correo no valido').isEmail(),
		check('password', 'la clave es obligatoria').not().isEmpty()
	],
	loginUsuario
); //inicion de sesion
router.post(
	'/subscription',
	[
		check('email', 'correo no valido').isEmail(),
		check('password', 'la clave es obligatoria').not().isEmpty(),
		check('name', 'el nombre es obligatorio').not().isEmpty(),
		check('storeName', 'el nombre de la tienda es obligatorio').not().isEmpty()
	],
	postUsuario
);
router.post('/save-password', recuperarClave);

//ruta actualizacion clave
router.put('/new-password', newPassword);
//actualizacion de datos
router.put('/actualizar', [validarJWT], actualizarDatos);

//rotas dashboard adminstrador

router.put('/suspender', suspenderCuenta);
router.put('/activar', activarCuenta);
router.get('/mostrar', mostrar); //Mostrar usuarios formato Json

//actualizar valores de planes

router.put('/valores', nuevosValores);

//actualizar los planes desde el usuario

//*********RUTAS DEL DASHBOARD LOCAL*****************/

//items menu dashboard local

router.get('/dashboard/items', mostrarMenu);

router.put('/dashboard/items', [validarJWT], actualizarMenu);

router.post('/dashboard/items', [validarJWT], agregarProducto);

router.delete('/dashboard/items', [validarJWT], borrarProducto);
router.put('/actualizar-img', [validarJWT], cambiarImagenLocal);
router.delete(
	'/dashboard/items/borrar-categoria',

	borrarCategoria
);
router.delete(
	'/dashboard/items/borrar-subcategoria',

	borrarSubCategoria
);

//actualizar los planes desde el usuario
router.put('/dashboard/actulizar-plan', [validarJWT], mejorarPlan);
//mostar categorias por local

router.get('/dashboard/categorias', [validarJWT], mostrarCategorias);
router.get('/dashboard/subcategorias', [validarJWT], mostrarsubCategorias);
router.post('/dashboard/newcategoria', [validarJWT], crearCategoria);
router.post('/dashboard/newsubcategoria', [validarJWT], crearSubCategoria);

//manejos de pedidos local

router.get('/dashboard/pedidos', [validarJWT], mostrarPedidos);
router.delete('/liberar-pedido', [validarJWT], liberarPedido);

//chat local
router.get('/dashboard/chat', [validarJWT], getChatLocal);

//cancerlar cuenta
router.get('/dashboard/cancelar', [validarJWT], cancelarPlan);

//****************RUTAS DEL MENU******************
router.post('/pedido', realizarPedidos);
router.get('/menu/subcategorias', mostrarsubCategoriasMenu);
router.get('/menu/categorias', mostrarCategoriasMenu);
router.get('/menu', mostrarPlan);
router.get('/menu/chat', getChatMenu);

module.exports = router;
