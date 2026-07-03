const express = require("express");
const router = express.Router();
const saldosController = require("../controllers/saldosController");

router.get("/saldos", saldosController.consultaAhorrosSueldo);
router.get("/historial", saldosController.obtenerHistorialMovimientos);
module.exports = router;