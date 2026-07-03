const express = require("express");
const router = express.Router();
const transferenciasController = require("../controllers/transferenciasController");

router.post("/transferencias/propia", transferenciasController.ejecutarTransferenciaPropia);
router.post("/transferencias/evaluar", transferenciasController.evaluarYEnrutarTerceros);
router.post("/transferencias/nacionales", transferenciasController.transferenciaNacional);
module.exports = router;