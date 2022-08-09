const jwt = require('jsonwebtoken')

const { response } = require("express");
const { request } = require("express");

const Usuario = require('../models/user')

const validarJWT = async (req=request, res=response, next) => {
    const token = req.header('x-token');

    if(!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        })
    }

    try {
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const usuario = await Usuario.findById(uid)

        if(!usuario) {
            return res.status(401).json({
                msg: 'El usuario no existe - usuario no encontrado en la bd'
            })
        }

        if(!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no válido: usuario con estado false'
            })
        }

        req.usuario = usuario;

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        })
    }
}

module.exports = {
    validarJWT
}