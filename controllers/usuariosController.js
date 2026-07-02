const usuariosModel = require("../models/usuariosModel");

const usuariosController = {
  getAllUsuarios: async (req, res) => {
    try {
      const usuarios = await usuariosModel.getAllUsuarios();
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
};

module.exports = usuariosController;