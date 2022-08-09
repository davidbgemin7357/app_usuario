const path = require('path')
const fs = require('fs')
const { request, response } = require("express");
const { subirArchivo } = require("../helpers/subir-archivo");
const { Usuario, Producto } = require("../models");

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)

const cargarArchivo = async (req=request, res=response) => {
    try {
        const nombre = await subirArchivo(req.files, undefined, 'imgs');
        res.json({nombre})
    } catch (msg) {
        res.status(400).json({msg})
    }
}

const actualizarImagen = async (req=request, res=response) => {
    const {id, coleccion} = req.params;
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe el usuario con id: ${id}`
                })
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe el producto con id: ${id}`
                })
            }
            break;
    
        default:
            return res.status(500).json({
                msg: `Se me olvidó validar esto :v`
            })
            break;
    }

    // limpiar imágenes previas:
    if (modelo.img) {
        // hay que borrar la imagen del servidor:
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen)
        }
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;

    await modelo.save();

    res.json(modelo)
}

const actualizarImagenCloudinary = async(req=request, res=response) => {
    const {id, coleccion} = req.params;
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id: ${id}`
                });
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto en el id: ${id}`
                });
            }
            break;
    
        default:
            return res.status(500).json({
                msg: `Se me olvidó validar esto :v`
            });
            break;
    }

    // limpiar imágenes previas:
    if (modelo.img) {
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length -1];
        const [public_id] = nombre.split('.');

        cloudinary.uploader.destroy(public_id);
    }

    const {tempFilePath} = req.files.archivo
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath,
        // redimensionamiento de la imagen:
        {transformation: [
            {height: 300, width: 250, crop: "fill"},
        ]})
    modelo.img = secure_url;

    await modelo.save();

    res.json(modelo)
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    actualizarImagenCloudinary
}