const express = require("express");
const router = express.Router();
const pagosController = require("../controllers/pagosController");

router.post("/pagos/servicios", pagosController.pagarServicios);
router.post("/tarjetas/pasar-a-cuotas", pagosController.cuotificarCompras);
module.exports = router;