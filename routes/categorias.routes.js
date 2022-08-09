const {Router} = require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categoria.controller');
const { existeCategoriaPorId, categoriaActiva } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middleware');


const router = Router();

// mostrar todas la categorias (público)
router.get('/', obtenerCategorias)

// mostrar categoria por id (público):
router.get('/:id', [
    check('id', 'No es un id de mongo').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    check('id').custom(categoriaActiva),
    validarCampos,
], obtenerCategoria)

// crear categoría (privado: con cualquier rol, cualquier persona con token válido)
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre de la categoría es obligatorio').not().isEmpty(),
    validarCampos
],crearCategoria)

// actualizar categoria (privado: cualquier con token válido):
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre de la categoría es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaPorId),
    validarCampos,
], actualizarCategoria)

// eliminar categoría (privado: solo ADMIN_USER):
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de mongo válido').isMongoId(),
    validarCampos,
    check('id').custom(existeCategoriaPorId)
], borrarCategoria)


module.exports = router;