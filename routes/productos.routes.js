const { Router } = require('express');
const { check } = require('express-validator');
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, eliminarProducto } = require('../controllers/producto.controller');
const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middleware');

const router = Router();

// obtener todos los productos (publico):
router.get('/', obtenerProductos)

// obtener producto por id (publico):
router.get('/:id', [
    check('id', 'No es un id de mongo válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], obtenerProducto)

// crear producto (privado: con cualquier role, cualquier persona con token)
// el nombre del producto y el id de la categoria son obligatorios:
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre del producto es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de mongo').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos,
], crearProducto)

// actualizar producto por id
router.put('/:id', [
    validarJWT,
    check('id').custom(existeProductoPorId),
    validarCampos
], actualizarProducto)

// eliminar producto por id:
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de mongo valid').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos,
], eliminarProducto)

module.exports = router;