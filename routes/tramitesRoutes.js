const express = require("express");
const tramitesController = require("../controllers/tramitesController");
const router = express.Router();

router.post("/seguridad/login", tramitesController.loginAutenticacion); // S001
router.post("/pagos/servicios", tramitesController.pagarServicios); // S008
router.post("/credito/simular", tramitesController.simularCreditoCampaña); // S009
router.post("/credito/desembolsar", tramitesController.desembolsarPréstamoOnline); // S010
router.post("/tarjetas/pasar-a-cuotas", tramitesController.cuotificarCompras);
router.post("/divisas/tipo-cambio", tramitesController.ejecutarTipoCambioPreferencial);
router.post("/productos/solicitar", tramitesController.solicitarProductoOnline);
router.post("/seguridad/token-digital", tramitesController.validarTokenDigitalInvisble);

module.exports = router;