const express = require("express");
const cors = require("cors");
const fileUpload = require('express-fileupload')

const { dbConnection } = require("../db/db.config");

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        // ruta principal
        this.route_root = "/api/usuarios";

        // ruta para roles:
        // this.route_roles = "/api/roles";

        // rutas para autenticación con token:
        // this.authPath = "/api/auth";

        // rutas (final):
        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            categorias: '/api/categorias',
            usuarios: '/api/usuarios',
            productos: '/api/productos',
            roles: '/api/roles',
            uploads: '/api/uploads',
        }

        // conexión a base de datos:
        this.conectarDB();

        // middlewares:
        this.middlewares();

        // rutas:
        this.router();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        // cors:
        this.app.use(cors());

        // lectura y parseo del body:
        this.app.use(express.json());

        // directorio público:
        this.app.use(express.static("public"));

        // fileupload - carga de archivos:
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true,
        }))
    }

    router() {
        // this.app.use(this.authPath, require('../routes/auth.routes'))
        // this.app.use(this.route_root, require("../routes/user.routes"));
        // this.app.use(this.route_roles, require("../routes/role.routes"));
        
        // rutas finales:
        this.app.use(this.paths.auth, require('../routes/auth.routes'));
        this.app.use(this.paths.buscar, require('../routes/buscar.routes'));
        this.app.use(this.paths.usuarios, require('../routes/user.routes'));
        this.app.use(this.paths.productos, require('../routes/productos.routes'));
        this.app.use(this.paths.categorias, require('../routes/categorias.routes'));
        this.app.use(this.paths.roles, require('../routes/role.routes'));
        this.app.use(this.paths.uploads, require('../routes/uploads.routes'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log("Servidor corriendo en el puerto: " + this.port);
        });
    }
}

module.exports = Server;
