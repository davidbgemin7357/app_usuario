const { response, request } = require("express");
const bcryptjs = require("bcryptjs");
const {Usuario} = require("../models");

const userGet = async (req = request, res = response) => {
    // postman (GET): http://localhost:8000/api/usuarios?nombre=David&apiKey=1234
    // const {q, nombre, apiKey, pais='Sin país'} = req.query
    // res.json({
    //     msg: "GET exitoso",
        // q, nombre, apiKey, pais,
    // });

    // postman (GET): http://localhost:8000/api/usuarios?limite=7
    const {limit=5, desde=0} = req.query;
    const query = {estado:true}

    const [total, usuarios] = await Promise.all([
        // cuenta el total de usuarios con estado=true
        Usuario.count(query),
        // muestra a los usuarios con estado=true
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limit))
    ])

    res.json({
        total, usuarios
    })

};

const userPost = async (req = request, res = response) => {
    // !* al momento de hacer post, el rol debe estar creado en la bd. Los roles permitidos son: "ADMIN_ROLE", "USER_ROLE", "VENTAS_ROLE"
    // postman (POST): http://localhost:8000/api/usuarios/
    // const { nombre } = req.body;

    const { nombre, correo, password, role } = req.body;
    const usuario = new Usuario({ nombre, correo, password, role });

    // encriptación de contraseña:
    const salt = bcryptjs.genSaltSync(10);
    usuario.password = bcryptjs.hashSync(password, salt);

    await usuario.save();

    res.status(201).json({
        usuario,
    });
};

const userPut = async (req = request, res = response) => {
    // postman (PUT): http://localhost:8000/api/usuarios/asdfa
    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    if (password) {
        const salt = bcryptjs.genSaltSync(10);
        resto.password = bcryptjs.hashSync(password, salt);
    }

    // resto tiene el nombre, rol, password y estado: esto es lo único que se puede actuaizar:
    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.status(400).json({
        usuario
    })
};

const userDelete = async (req = request, res = response) => {
    const {id} = req.params

    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false})
    res.json({usuario})
};

module.exports = {
    userGet,
    userPost,
    userPut,
    userDelete,
};
