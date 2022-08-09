const { Categoria, Producto } = require("../models");
const Rol = require("../models/role");
const Usuario = require("../models/user");

const emailExiste = async (correo = "") => {
    const emailExiste = await Usuario.findOne({ correo: correo });

    if (emailExiste) {
        throw new Error(`El correo: ${emailExiste.correo} ya está registrado`);
    }
};

const esRoleValido = async (rol = "") => {
    const exiteRol = await Rol.findOne({ rol });
    if (!exiteRol) {
        throw new Error(`El rol ${rol} no está registrado en la base de datos`);
    }
};

const existeUserPorId = async (id = "") => {
    // verificar si el usuario existe:
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id: ${id} no existe`);
    }
};

const esRoleValidoII = async (rol = "") => {
    const exiteRol = await Rol.findOne({ rol });

    if (exiteRol) {
        throw new Error(`El rol ya existe en la base de datos`);
    }
};

const existeCategoriaPorId = async (id) => {
    // verificar si la categoría existe:
    const existeCategoria = await Categoria.findById(id);

    if (!existeCategoria) {
        throw new Error("La categoria no existe");
    }
};

const categoriaActiva = async (id) => {
    // verificar si el estado de la categoria es activo:
    const isActiveCategory = await Categoria.findById(id);

    if (!isActiveCategory.estado) {
        throw new Error("La categoria está deshabilitada");
    }
};

const existeProductoPorId = async (id) => {
    // verificar si el producto existe:
    const existeProducto = await Producto.findById(id);
    if (!existeProducto) {
        throw new Error(`El producto de id ${id} no existe`);
    }
};

const coleccionesPermitidas = (coleccion = "", colecciones = []) => {
    const incluida = colecciones.includes(coleccion);
    if (!incluida) {
        throw new Error(
            `La coleccion ${coleccion} no está permitida. Colecciones permitidas: ${colecciones}`
        );
    }
    return true
};

module.exports = {
    emailExiste,
    esRoleValido,
    existeUserPorId,
    esRoleValidoII,
    existeCategoriaPorId,
    categoriaActiva,
    existeProductoPorId,
    coleccionesPermitidas,
};
