const Usuario = require("./usuario.model")

async function getUsuarioMongo(filtros) {
    filtros.isActive = true;
    const usuariosFiltrados = await Usuario.find(filtros);
    
    return usuariosFiltrados;
}

async function createUsuarioMongo(datos) {
    const usuarioCreado = await Usuario.create(datos);

    return usuarioCreado;
}

async function updateUsuarioMongo(id, cambios) {
    const resultado = await Usuario.findByIdAndUpdate(id, cambios);

    return resultado
}

async function deleteUsuarioMongo(id) {
    const resultado = await Usuario.findByIdAndUpdate(id, { isActive: false }, { new: true });

    return resultado;
}

module.exports = {
    createUsuarioMongo,
    getUsuarioMongo,
    updateUsuarioMongo,
    deleteUsuarioMongo
};