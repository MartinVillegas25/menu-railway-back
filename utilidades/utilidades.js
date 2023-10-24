const crearMensaje = (mesa, mensaje) => {

    return {
        mesa: "Mesa:" + mesa,
        mensaje,
        fecha: new Date().getTime()
    };

}

module.exports = {
    crearMensaje
}