const { Router } = require("express");
const {check} = require('express-validator')

const {
    userGet,
    userPost,
    userPut,
    userDelete,
} = require("../controllers/user.controller");
const { esRoleValido, existeUserPorId, emailExiste } = require("../helpers/db-validators");

const {
    validarCampos, validarJWT, tieneRole
} = require('../middleware')

const router = Router();

// ? Método GET:
router.get("/", userGet);

// ? Método POST:
router.post("/", [
    validarJWT,
    check('nombre', 'El nombre es obigatorio').not().isEmpty(),
    // en lugar de correo, será user login para la creación de nuevo usuario:
    check('password', 'El password debe de ser de más de 8 caractéres').isLength({min:8}),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom(emailExiste),

    // validaciones custom:
    check('role').custom(esRoleValido),
    // Mostrar los errores en el postman y no por consola:
    validarCampos
],userPost);

// ? Método PUT:
router.put("/:id", [
    validarJWT,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeUserPorId),
    check('nombre', 'El nombre es obigatorio').not().isEmpty(),
    check('password', 'El password debe de ser de más de 8 caractéres').isLength({min:8}),
    check('rol').custom(esRoleValido),
    validarCampos
],userPut);

// ? MÉTODO DELETE:
router.delete("/:id", [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id', 'No es un id válido'),
    check('id').custom(existeUserPorId),
    validarCampos,
],userDelete);

module.exports = router;
