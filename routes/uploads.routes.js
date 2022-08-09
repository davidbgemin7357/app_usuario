const { Router } = require("express");
const { check } = require("express-validator");
const { cargarArchivo, actualizarImagen, actualizarImagenCloudinary } = require("../controllers/uploads.controller");
const { coleccionesPermitidas } = require("../helpers/db-validators");
const { validarCampos, validarJWT } = require("../middleware");
const { validarArchivoSubir } = require("../middleware/validar-archivo");

const router = Router();

// enviar archivos: postman (POST): http://localhost:8080/api/uploads/ [body: form-data]
router.post("/", [validarArchivoSubir], cargarArchivo);

// actualizar imagen de usuarios y productos:
router.put('/:coleccion/:id', [
    validarJWT,
    validarArchivoSubir,
    check('id', 'El id debe ser id de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos,
], actualizarImagenCloudinary)

// !* actualizar imagen de forma local (en mi propia pc):
// router.put('/:coleccion/:id', [
//     validarArchivoSubir,
//     check('id', 'El id debe ser id de mongo').isMongoId(),
//     check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
//     validarCampos
// ], actualizarImagen)

module.exports = router;