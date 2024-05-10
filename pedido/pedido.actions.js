const Pedido = require("./pedido.model")

async function getPedidoMongo(filtros) {
    filtros.isActive = true;
    const cantidadPedidos = await Pedido.countDocuments(filtros);
    const pedidosFiltrados = await Pedido.find(filtros);

    return {
        resultados: pedidosFiltrados,
        cantidadProductos: cantidadPedidos
    };
}

async function createPedidoMongo(datos) {
    const pedidoCreado = await Pedido.create(datos);

    return pedidoCreado;
}

async function updatePedidoMongo(id, cambios) {
    const resultado = await Pedido.findByIdAndUpdate(id, cambios);

    return resultado
}

async function deletePedidoMongo(id) {
    const resultado = await Pedido.findByIdAndUpdate(id, { isActive: false }, { new: true });

    return resultado;
}

module.exports = {
    createPedidoMongo,
    getPedidoMongo,
    updatePedidoMongo,
    deletePedidoMongo
};