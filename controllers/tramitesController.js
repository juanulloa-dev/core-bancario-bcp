const bcpModel = require("../models/bcpModel");

const tramitesController = {
  // 10. Pago de Servicios Básicos (Integrante 4)
  pagarServicios: async (req, res) => {
    const { idServicio, cuentaId } = req.body;
    try {
      const servicio = await bcpModel.obtenerDeudaServicio(idServicio);
      await bcpModel.descontarSaldo(cuentaId, servicio.monto_deuda);
      res.status(200).json({ exito: true, empresa: servicio.empresa, suministro: servicio.codigo_suministro, montoCancelado: servicio.monto_deuda, mensaje: "Recibo pagado vía Convenios BCP." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // 11. Pasar compras a Cuotas (Integrante 4)
  cuotificarCompras: async (req, res) => {
    const { idCompra, nroCuotas } = req.body;
    try {
      await bcpModel.actualizarEstadoCompra(idCompra, `FRACCIONADO_${nroCuotas}_MESES`);
      res.status(200).json({ exito: true, compraId: idCompra, cuotasPactadas: nroCuotas, tasaInteresMensual: "1.99%" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // 12. Tipo de cambio preferencial (Integrante 4)
  ejecutarTipoCambioPreferencial: async (req, res) => {
    const { montoDolares, tipoOperacion } = req.body;
    const tasa = tipoOperacion === "COMPRA" ? 3.715 : 3.745;
    res.status(200).json({ operacion: "Tipo de Cambio Preferencial", tasaAplicada: tasa, totalSoles: Math.round((montoDolares * tasa) * 100) / 100 });
  },

  // 13. Solicitud de Productos Online (Integrante 5)
  solicitarProductoOnline: async (req, res) => {
    res.status(200).json({ estadoSolicitud: "APROBADO_100%_ONLINE", producto: req.body.tipoProducto, firma: "TOKEN_DIGITAL_AUTORIZADO" });
  },

  // 14. Token Digital Criptográfico (Integrante 5)
  validarTokenDigitalInvisble: async (req, res) => {
    res.status(200).json({ modulo: "Token Digital Integrado", estado: "ACTIVO_INVISIBLE", algoritmo: "TOTP_SHA256" });
  }
};

module.exports = tramitesController;