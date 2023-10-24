

class Usuarios {

    constructor() {
        this.personas = [];
    }

    agregarPersona(id, mesa, email) {

        let persona = { id, mesa, email };

        this.personas.push(persona);

        return this.personas;

    }

    getPersona(id) {
        let persona = this.personas.filter(persona => persona.id === id)[0];

        return persona;
    }

    getPersonas() {
        return this.personas;
    }

    getPersonasPorSala(email) {
        let personasEnSala = this.personas.filter(persona => persona.email === email);
        return personasEnSala;
    }

    borrarPersona(id) {

        let personaBorrada = this.getPersona(id);

        this.personas = this.personas.filter(persona => persona.id != id);

        return personaBorrada;

    }


}


module.exports = {
    Usuarios
}