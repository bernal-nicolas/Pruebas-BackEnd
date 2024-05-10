const mongoose = require("mongoose");

const schemaProducto = new mongoose.Schema({
    nombre: {type: String, required: true},
    password: {type: String, required: true},
    isActive: { type: Boolean, required: true, default: true }
  }, {
    versionKey: false,
    timestamps: true
});
  
const Model = mongoose.model('Usuario', schemaProducto);

module.exports = Model;