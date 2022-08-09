const { Schema, model } = require("mongoose");

const UsuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es obligatorio"],
    },
    correo: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligatoria"],
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        enum: ["ADMIN_ROLE", "USER_ROLE", "VENTAS_ROLE"],
        default: "USER_ROLE"
    },
    estado: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    },
});

UsuarioSchema.methods.toJSON = function()  {
    const {__v, password, _id, ...usuario} = this.toObject();
    usuario.uid = _id;
    return usuario
}

module.exports = model("Usuario", UsuarioSchema);
