const { throwCustomError } = require("../utils/functions");
const { createLibroMongo, getLibroMongo, updateLibroMongo, deleteLibroMongo } = require("./libro.actions");

async function readLibroConFiltros(query) {
    const { nombre, autor, genero, fecha, editorial } = query;

    const resultadosBusqueda = await getLibroMongo(query);

    return resultadosBusqueda;
}

async function createLibro(datos) {
    const { nombre, autor, genero, fecha, editorial } = datos;

    const libroCreado = await createLibroMongo(datos);

    return libroCreado;
}

function updateLibro(datos) {
    const { _id, ...cambios } = datos;

    const libroActualizado = updateLibroMongo(_id, cambios);

    return libroActualizado;
}

function deleteLibro(id) {
    const libroEliminado = deleteLibroMongo(id);

    return libroEliminado;
}

module.exports = {
    readLibroConFiltros,
    createLibro,
    updateLibro,
    deleteLibro
}