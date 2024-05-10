const mongoose = require("mongoose");

const schemaProducto = new mongoose.Schema({
    fecha: {type: Date, required: true},
    estado: {type: String, required: true},
    lista_libros: {type: [String], required: true},
    isActive: { type: Boolean, required: true, default: true }
  }, {
    versionKey: false,
    timestamps: true
});
  
const Model = mongoose.model('Pedido', schemaProducto);

module.exports = Model;