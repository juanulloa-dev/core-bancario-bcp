const express = require("express");
const router = express.Router();
const prestamosController = require("../controllers/prestamosController");

router.post("/credito/simular", prestamosController.simularCreditoCampaña);
router.post("/credito/desembolsar", prestamosController.desembolsarPréstamoOnline);
module.exports = router;