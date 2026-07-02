const express = require("express");
const tramitesController = require("../controllers/tramitesController");
const router = express.Router();

router.post("/pagos/servicios", tramitesController.pagarServicios);
router.post("/tarjetas/pasar-a-cuotas", tramitesController.cuotificarCompras);
router.post("/divisas/tipo-cambio", tramitesController.ejecutarTipoCambioPreferencial);
router.post("/productos/solicitar", tramitesController.solicitarProductoOnline);
router.post("/seguridad/token-digital", tramitesController.validarTokenDigitalInvisble);

module.exports = router;