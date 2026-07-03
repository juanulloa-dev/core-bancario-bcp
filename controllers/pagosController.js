const pagosModel = require("../models/pagosModel");
const transferenciasModel = require("../models/transferenciasModel");
const pagosController = {
  pagarServicios: async (req, res) => {
    try {
      const { idServicio, cuentaId } = req.body;
      const servicio = await pagosModel.obtenerDeudaServicio(idServicio);
      if (!servicio) return res.status(404).json({ mensaje: "No hay deuda." });
      await transferenciasModel.descontarSaldo(cuentaId, servicio.monto_deuda);
      res.status(200).json({ exito: true, empresa: servicio.empresa, totalPagado: parseFloat(servicio.monto_deuda) });
    } catch (error) { res.status(500).json({ error: error.message }); }
  },
  cuotificarCompras: async (req, res) => {
    try {
      await pagosModel.actualizarEstadoCompra(req.body.idCompra, `FRACCIONADO_MESES`);
      res.status(200).json({ exito: true });
    } catch (error) { res.status(500).json({ error: error.message }); }
  }
};
module.exports = pagosController;