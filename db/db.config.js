const mongoose = require("mongoose");

const dbConnection = async () => {
    try {
        // conexión a mongdb:
        // trabajar con la bd de la nube:
        // await mongoose.connect(process.env.MONGODB_CN, {
        // trabajar la bd local
        await mongoose.connect('mongodb://localhost:27017/node_usuarios', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, (err, resp) => {
            if (err) throw err;
            console.log('Base de datos conectada')
        })

    } catch (error) {
        console.log(error);
        throw new Error('Error al iniciar la base de datos')
    }
};

module.exports = {
    dbConnection,
};
