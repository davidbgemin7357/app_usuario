const { Usuario, Categoria, Producto, Role } = require('../models')
const { request, response } = require("express");
const { ObjectId } = require('mongoose').Types;


const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
]

const buscarUsuarios = async (termino='', res=response) => {
    // postman (GET): http://localhost:8080/api/buscar/usuarios/627c5040226912a902a67652
    // id de mongo válidoL:
    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const usuario = await Usuario.findById(termino)
        return res.json({
            results: (usuario) ? [usuario] : []
        })
    }

    // postman (GET): http://localhost:8080/api/buscar/usuarios/david
    // Expresiones regulares: i => insensible a las mayúsculas y minúsculas:
    const regex = new RegExp(termino, 'i')

    const usuarios =await Usuario.find({
        // el nombre o el correo coinciden con el regex():
        $or: [{nombre: regex, estado: true}, {correo: regex, estado: true}],
        // y abmos deben listar usuarios en estado = true:
        $and: [{estado: true}]
    });

    res.json({
        results: usuarios
    })
}

const buscarCategorias = async (termino='', res=response) => {
    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: categoria ? [categoria] : []
        })
    }
    // Expresiones regulares: i => insensible a las mayúsculas y minúsculas:
    const regex = new RegExp(termino, 'i')

    const categorias = await Categoria.find({
        nombre: regex,
        estado: true,
    })
    res.json({
        results: categorias
    })
}

const buscarProductos = async (termino='', res=response) => {
    const esMongoID = ObjectId.isValid(termino)

    if(esMongoID) {
        const producto = await Producto.findById(termino).populate('categoria', 'nombre');
        return res.json({
            results: producto ? [producto] : []
        })
    }

    // Expresiones regulares: i => insensible a las mayúsculas y minúsculas:
    const regex = new RegExp(termino, 'i')

    const productos = await Producto.find({nombre: regex, estado: true})
                        .populate('categoria', 'nombre')

    res.json({
        results: productos
    })
}

const buscarRoles = async (termino='', res=response) => {
    const esMongoID = ObjectId.isValid(termino)

    if (esMongoID) {
        const rol = await Role.findById(termino);
        return res.json({
            results: rol ? [rol] : []
        });
    }

    const regex = new RegExp(termino, 'i')

    const roles = await Role.find({rol: regex})

    res.json({
        results: roles
    })
}

// termino puede user un id de mongo registrado en la bd o un término regex
const buscar = (req=request, res=response) => {
    const {coleccion, termino} = req.params;

    if(!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res)
            break;
        case 'categorias':
            buscarCategorias(termino, res)
            break;
        case 'productos':
            buscarProductos(termino, res)
            break;
        case 'roles':
            buscarRoles(termino, res)
            break;
        default:
            res.status(500).json({
                msg: 'Se me olvidó hacer esta búsqueda :p'
            })
            break;
    }
}

module.exports = {
    buscar
}