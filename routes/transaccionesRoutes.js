const express = require("express");
const transaccionesController = require("../controllers/transaccionesController");
const router = express.Router();

router.post("/yape/enviar", transaccionesController.yapearIntegrado);
router.post("/transferencias/nacionales", transaccionesController.transferenciaNacional);
router.post("/retiro-sin-tarjeta/generar", transaccionesController.generarRetiroSinTarjeta);
router.post("/transferencias/internacionales", transaccionesController.transferenciaInternacional);

module.exports = router;