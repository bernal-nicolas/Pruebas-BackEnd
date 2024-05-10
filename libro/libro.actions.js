const Libro = require("./libro.model")

async function getLibroMongo(filtros) {
    filtros.isActive = true;
    const cantidadLibros = await Libro.countDocuments(filtros);
    const librosFiltrados = await Libro.find(filtros);
    
    return {
        resultados: librosFiltrados,
        "Cantidad de Libros": cantidadLibros
    };
}

async function createLibroMongo(datos) {
    const libroCreado = await Libro.create(datos);

    return libroCreado;
}

async function updateLibroMongo(id, cambios) {
    const resultado = await Libro.findByIdAndUpdate(id, cambios);

    return resultado
}

async function deleteLibroMongo(id) {
    const resultado = await Libro.findByIdAndUpdate(id, { isActive: false }, { new: true });

    return resultado;
}

module.exports = {
    createLibroMongo,
    getLibroMongo,
    updateLibroMongo,
    deleteLibroMongo
};