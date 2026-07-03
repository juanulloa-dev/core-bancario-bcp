const express = require("express");
const router = express.Router();
const seguridadController = require("../controllers/seguridadController");

router.post("/login", seguridadController.loginAutenticacion);
router.post("/tarjetas/configuracion", seguridadController.configurarPermisosTarjeta);
router.put("/tarjetas/cambio-pin", seguridadController.cambiarPinDebito);
router.get("/tarjetas/cvv-dinamico/:id", seguridadController.generarCvvDinamico);
module.exports = router;