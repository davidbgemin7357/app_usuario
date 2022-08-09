const { request, response } = require("express")

const validarArchivoSubir = (req=request, res=response, next) => {
    //              si viene un archivo y tiene propiedades === 0 
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).send({mesg: 'No hay archivos que subir - validarArchivoSubir'})
    }

    next();
}

module.exports = {
    validarArchivoSubir
}