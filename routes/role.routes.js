const { Router } = require("express");
const { check } = require("express-validator");
const router = Router();

const { roleGet, rolePost } = require("../controllers/role.controller");
const { esRoleValidoII } = require("../helpers/db-validators");
const { validarCampos } = require("../middleware");

router.get("/", roleGet)
router.post("/", [
    check('rol', 'El rol no debe ir vacío').not().isEmpty(),
    check('rol', 'El rol ya existe en la base de datos').custom(esRoleValidoII),
    check('rol', 'No es rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE', 'VENTAS_ROLE']),
    validarCampos
],rolePost)

module.exports = router;
