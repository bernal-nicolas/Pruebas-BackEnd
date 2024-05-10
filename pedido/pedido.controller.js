const { throwCustomError } = require("../utils/functions");
const { createPedidoMongo, getPedidoMongo, updatePedidoMongo, deletePedidoMongo } = require("./pedido.actions");
const { deleteLibroMongo } = require("../libro/libro.actions");

function validarEstado(estado) {
    const estadosValidos = ["En progreso", "Completado", "Cancelado"];
    if (!estadosValidos.includes(estado)) {
        throwCustomError(400, "Estado inválido o no colocaste ningun estado. Los estados permitidos son: 'En progreso', 'Completado', 'Cancelado'.");
    }
}

async function readPedidoConFiltros(query) {
    const { fecha_inicial, fecha_final } = query;

    if (!fecha_inicial || !fecha_final) {
        throwCustomError(400, "Debe proporcionar tanto la fecha inicial como la fecha final.");
    }


    const filtros = {
        fecha: {
            $gte: new Date(fecha_inicial),
            $lte: new Date(fecha_final)
        },
        isActive: true
    };

    const resultadosBusqueda = await getPedidoMongo(filtros);

    return resultadosBusqueda;
}

async function createPedido(datos) {
    validarEstado(datos.estado);
    const pedidoCreado = await createPedidoMongo(datos);
    return pedidoCreado;
}

async function updatePedido(datos) {
    const { _id, estado } = datos;
    validarEstado(estado);
    
    const cambios = { estado };
    const pedidoActualizado = await updatePedidoMongo(_id, cambios);
    return pedidoActualizado;
}

function deletePedido(id) {

    const pedidoEliminado = deletePedidoMongo(id);

    return pedidoEliminado;
}

module.exports = {
    readPedidoConFiltros,
    createPedido,
    updatePedido,
    deletePedido
}