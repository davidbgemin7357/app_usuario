const { request, response } = require("express");
const { Producto } = require("../models");

const obtenerProductos = async (req=request, res=response) => {
    const {limite=5, desde=0} = req.query;
    const query = {estado: true}

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ])
    res.json({total, productos})
}

const obtenerProducto = async (req=request, res=response) => {
    const {id} = req.params;
    const producto = await Producto.findById(id)
                            .populate('usuario', 'nombre')
                            .populate('categoria', 'nombre')

    res.status(200).json({
        producto
    })
}

// para crear producto se envía por el body todo menos el usuario y el estado (nombre, precio, categoria.id, descripcion, disponible)
const crearProducto = async (req=request, res=response) => {
    const {estado, usuario, ...body} = req.body;

    const productoDB = await Producto.findOne({nombre:body.nombre.toUpperCase()});

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        })
    }

    /* guardar la data a guardar */
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = new Producto(data);
    
    // guardar db:
    await producto.save()

    res.status(201).json(producto);
}

const actualizarProducto = async (req=request, res=response) => {
    // Estado, usuario y id no se pueden modificar
    const {id} = req.params;
    const {estado, usuario, ...data} = req.body;

    if(data.nombre) {
        data.nombre = data.nombre.toUpperCase()
    }

    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, {new: true});

    res.json({
        msg: 'Se actualizó el producto correctamente',
        producto
    })
}

const eliminarProducto = async (req=request, res=response) => {
    const {id} = req.params;
    const producto = await Producto.findByIdAndUpdate(id, {estado: false}, {new: true})

    res.json({
        msg: 'Se borró el producto',
        producto,
    })
}

module.exports = {
    crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, eliminarProducto
};
