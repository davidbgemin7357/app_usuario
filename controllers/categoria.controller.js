const { request, response } = require("express");
const {Categoria} = require("../models");


const obtenerCategorias = async (req=request, res=response) => {
    const {limite=5, desde=0} = req.query
    const query = {estado: true}

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
        // .populate: muestra el usuario que creó la categoría y el nombre de la categoría:
            .populate('usuario', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({total, categorias})
}

const crearCategoria = async (req=request, res=response) => {
    const nombre = req.body.nombre.toUpperCase();
    const categoriaDB = await Categoria.findOne({nombre})


    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        })
    }

    const data = {
        // el token del usuario debe ser validado. Se valida con el middleware validarJWT (en categorias.routes)
        nombre, usuario: req.usuario._id
    }

    const categoria = new Categoria(data);

    // guardar en la bd: para guardar el usuario debe estar logueado con token y enviar este token en el post http://localhost:8080/api/categorias
    await categoria.save();

    res.status(201).json({categoria})
}

const obtenerCategoria = async(req=request, res=response) => {
    const {id} = req.params;
    const categoria = await Categoria.findById(id).populate('usuario', 'nombre')

    res.json({categoria})
}

const actualizarCategoria = async (req=request, res=response) => {
    const {id} = req.params;
    // Lo único que se puede actualizar es: data(nombre y __v). Estado, usuario y id no se pueden modificar
    const {estado, usuario, ...data} = req.body;
    data.nombre = data.nombre.toUpperCase();

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true});

    res.json({
        msg: 'Se actualizó correctamente la información',
        categoria,
    });
}

const borrarCategoria = async (req=request, res=response) => {
    const {id} = req.params;
    const categoria = await Categoria.findByIdAndUpdate(id, {estado: false}, {new: true})

    res.json({
        msg: 'Se eliminó la categoría correctamente',
        categoria
    })
}

module.exports = {
    crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria
}