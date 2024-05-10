const mongoose = require("mongoose");

const schemaProducto = new mongoose.Schema({
    fecha: {type: Date, required: true},
    estado: {type: String, required: true},
    lista_libros: {type: [String], required: true},
    usuario_do: {type: String, required: true, default: " "}, // Usuario que hace la peticion
    usuario_rec: {type: String, required: true, default: " "}, // Usuario que recibe la peticion
    isActive: { type: Boolean, required: true, default: true }
  }, {
    versionKey: false,
    timestamps: true
});
  
const Model = mongoose.model('Pedido', schemaProducto);

module.exports = Model;