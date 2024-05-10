const express = require('express')
const router = express.Router();
const { readLibroConFiltros, createLibro, updateLibro, deleteLibro } = require("./libro.controller");
const { respondWithError } = require('../utils/functions');

async function GetLibros(req, res) {
    try {
        const resultadosBusqueda = await readLibroConFiltros(req.query);

        res.status(200).json({
            ...resultadosBusqueda
        })
    } catch(e) {
        res.status(500).json({msg: ""})
    }
}

async function PostLibro(req, res) {
    try {

        await createLibro(req.body);

        res.status(200).json({
            mensaje: "Éxito. 👍"
        })
    } catch(e) {
        respondWithError(res, e);
    }
}


async function PatchLibros(req, res) {
    try {

        await updateLibro(req.body);

        res.status(200).json({
            mensaje: "Éxito. 👍"
        })
    } catch(e) {
        respondWithError(res, e);
    }
}


async function DeleteLibros(req, res) {
    try {

        await deleteLibro(req.params.id);

        res.status(200).json({
            mensaje: "Éxito. 👍"
        })
    } catch(e) {
        respondWithError(res, e);
    }
}

router.get("/", GetLibros);
router.post("/", PostLibro);
router.patch("/", PatchLibros);
router.delete("/:id", DeleteLibros);


module.exports = router;
