const { request, response } = require("express");
const {Role} = require("../models");

const roleGet = async (req = request, res = response) => {
    const role = await Role.find();

    res.json({
        role,
    });
};

const rolePost = async(req = request, res = response) => {
    const { rol } = req.body;
    const role = new Role({rol})
    await role.save();

    res.status(201).json({
        role
    })

};

module.exports = {
    roleGet, rolePost
};
