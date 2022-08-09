const { response } = require("express");
const bcryptjs = require("bcryptjs");

const {Usuario} = require("../models");

const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");
const { DefaultTransporter } = require("google-auth-library");

const login = async (req = request, res = response) => {
    const { correo, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ correo });

        // verificar si el correo existe:
        if (!usuario) {
            return res.status(400).json({
                msg: "El correo es incorrecto o no está registrado",
            });
        }

        // verificar la contraseña:
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: "Contraseña incorrecta",
            });
        }

        // verificar si el usuario está activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: "El usuario está deshabilitado",
            });
        }

        // generar el jwt:
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token,
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            msg: "Algo salió mal. Intentar de nuevo",
        });
    }
};

const googleSignIn = async (req, res = response) => {
    // postman (POST): {"id_token"="token generado del front (html) que es token de google"}

    const { id_token } = req.body;

    try {
        const { correo, nombre, img } = await googleVerify(id_token);
        let usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            const data = {
                nombre,
                correo,
                rol: DefaultTransporter,
                password: "contrasena123",
                img,
                google: true,
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        if(!usuario.estado) {
            return res.status(401).json({
                msg: 'Usuario bloqueado'
            })
        }

        const token = await generarJWT(usuario.id);
        res.json({
            usuario, token
        })


    } catch (error) {
        res.status(400).json({
            msg: "El token no se pudo verificar",
        });
    }
};

module.exports = {
    login,
    googleSignIn,
};
