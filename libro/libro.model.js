const mongoose = require("mongoose");

const schemaProducto = new mongoose.Schema({
    nombre: {type: String, required: true},
    autor: {type: String, required: true},
    genero: {type: String, required: true},
    fecha: {type: Date, required: true},
    editorial: {type: String, required: true},
    isActive: { type: Boolean, required: true, default: true }
  }, {
    versionKey: false,
    timestamps: true
});
  
const Model = mongoose.model('Libro', schemaProducto);

module.exports = Model;