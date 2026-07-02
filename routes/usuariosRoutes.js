const express = require("express");
const usuariosController = require("../controllers/usuariosController");

const router = express.Router();

router.get("/", usuariosController.getAllUsuarios);

module.exports = router;