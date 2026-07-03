const express = require("express");
const transaccionesController = require("../controllers/transaccionesController");
const router = express.Router();

router.post("/yape/enviar", transaccionesController.yapearIntegrable); // S007
router.post("/transferencias/propia", transaccionesController.ejecutarTransferenciaPropia); // S004
router.post("/transferencias/evaluar", transaccionesController.evaluarYEnrutarTerceros); // S005
router.post("/transferencias/nacionales", transaccionesController.transferenciaNacional); // S006
router.post("/retiro-sin-tarjeta/generar", transaccionesController.generarRetiroSinTarjeta);
router.post("/transferencias/internacionales", transaccionesController.transferenciaInternacional);

module.exports = router;