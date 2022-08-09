const jwt = require('jsonwebtoken')

const generarJWT = (uid='') => {
    return new Promise((resolve, reject) => {
        const payload = {uid}

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h'
        }, (err, token) => {
            if (err) {
                console.log(err)
                reject('No se pudo generar el token')
            } else {
                resolve(`Se puedo generar el token: ${token}`)

            }
        })
    })
}

module.exports = {
    generarJWT
}