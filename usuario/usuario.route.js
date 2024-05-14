const express = require('express')
const router = express.Router();
const { readUsuarioConFiltros, createUsuario, updateUsuario, deleteUsuario } = require("./usuario.controller");
const { respondWithError } = require('../utils/functions');
const authenticateToken = require('../middlewares/authMiddleware');
const jwt = require('jsonwebtoken');

async function GetUsuarios(req, res) {
    try {
        const resultadosBusqueda = await readUsuarioConFiltros(req.query);

        res.status(200).json({
            ...resultadosBusqueda
        })
    } catch(e) {
        res.status(500).json({msg: ""})
    }
}

async function PostUsuario(req, res) {
    try {

        await createUsuario(req.body);

        const {body} = req;

        const token = jwt.sign(body, "TOKENBODY")
        
        console.log(token)

        res.status(200).json({
            mensaje: "Éxito. 👍"
        })
    } catch(e) {
        respondWithError(res, e);
    }
}


async function PatchUsuarios(req, res) {
    try {

        await updateUsuario(req.body);

        res.status(200).json({
            mensaje: "Éxito. 👍"
        })
    } catch(e) {
        respondWithError(res, e);
    }
}


async function DeleteUsuarios(req, res) {
    try {

        await deleteUsuario(req.params.id);

        res.status(200).json({
            mensaje: "Éxito. 👍"
        })
    } catch(e) {
        respondWithError(res, e);
    }
}

router.get("/", authenticateToken, GetUsuarios);
router.post("/", PostUsuario);
router.patch("/", authenticateToken, PatchUsuarios);
router.delete("/:id", authenticateToken, DeleteUsuarios);


module.exports = router;