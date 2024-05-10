const { throwCustomError } = require("../utils/functions");
const { createPedidoMongo, getPedidoMongo, updatePedidoMongo, deletePedidoMongo } = require("./pedido.actions");

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
    const { fecha, estado } = datos;

    if (estado !== "En progreso" && estado !== "Completado" && estado !== "Cancelado") {
        throwCustomError(501, "Estado invalido.");
    }

    const pedidoCreado = await createPedidoMongo(datos);

    return pedidoCreado;
}

function updatePedido(datos) {
    const { _id, ...cambios } = datos;

    const pedidoActualizado = updatePedidoMongo(_id, cambios);

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