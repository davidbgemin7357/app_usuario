const tieneRole = (...roles) => {
    return (req, res=response, next) => {
        // req.usuario es el usuario que hace la petición:
        console.log(req.usuario)
        if (!req.usuario) {
            return res.status(500).json({
                msg: 'Se quiere verificar el rol sin validar el token primero'
            })
        }

        if(!roles.includes(req.usuario.role)) {
            return res.status(401).json({
                msg: `El usuario ${req.usuario.nombre} tiene el rol ${req.usuario.role}. No tiene autorización`
            })
        }

        next();
    }
}

const esAdminRole = (req, res, next) => {
    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token primero'
        });
    }

    const {role, nombre} = req.usuario;

    if (role!="ADMIN_ROLE") {
        return res.status(401).json({
            msg: `${nombre} no es administrador - No está autorizado`
        })
    }
    next();
}

module.exports = {
    tieneRole, esAdminRole
}