const { Schema, model } = require("mongoose");

const RoleSchema = Schema({
    rol: {
        type: String,
        required: [true, "El rol es obligatorio"],
        enum: ["ADMIN_ROLE", "USER_ROLE", "VENTAS_ROLE"]
    },
});

RoleSchema.methods.toJSON = function () {
    const { __v, ...rol } = this.toObject();
    return rol;
};

module.exports = model("Role", RoleSchema);
