const express = require("express");
const cuentasController = require("../controllers/cuentasController");
const router = express.Router();

router.get("/saldos", cuentasController.consultaAhorrosSueldo);
router.get("/historial", cuentasController.obtenerHistorialMovimientos); // S003
router.post("/tarjetas/configuracion", cuentasController.configurarPermisosTarjeta);
router.put("/tarjetas/cambio-pin", cuentasController.cambiarPinDebito);
router.get("/tarjetas/cvv-dinamico/:id", cuentasController.generarCvvDinamico);
router.post("/wawaditos/guardar", cuentasController.gestionarWawaditos);

module.exports = router;