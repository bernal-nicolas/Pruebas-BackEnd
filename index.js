const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req,res) => {
    res.status(200).json({});
})

const rutasUsuario = require("./usuario/usuario.route")
app.use('/usuario', rutasUsuario);
const rutasLibro = require("./libro/libro.route")
app.use('/libro', rutasLibro);
const rutasPedido = require("./pedido/pedido.route")
app.use('/pedido', rutasPedido);

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Conectado al MongoDB Atlas"))
    .catch((error) => console.error(error))

app.listen(8080);