const prestamosModel = require("../models/prestamosModel");
const transferenciasModel = require("../models/transferenciasModel");
const prestamosController = {
  simularCreditoCampaña: async (req, res) => {
    try {
      const { montoSolicitado, cuotas } = req.body;
      const tcea = 45.50;
      const cuotaMensual = Math.round(((montoSolicitado * 1.45) / cuotas) * 100) / 100;
      const idSolicitud = "SOL-" + Math.floor(100000 + Math.random() * 900000);
      await prestamosModel.registrarSimulacion(idSolicitud, montoSolicitado, cuotas, tcea, cuotaMensual);
      res.status(200).json({ idSolicitud, montoCuotaEstimada: cuotaMensual, tceaAplicada: `${tcea}%` });
    } catch (error) { res.status(500).json({ error: error.message }); }
  },
  desembolsarPréstamoOnline: async (req, res) => {
    try {
      const { idSolicitud, cuentaId } = req.body;
      const simulacion = await prestamosModel.obtenerSimulacion(idSolicitud);
      if (!simulacion || simulacion.estado_solicitud === "DESEMBOLSADO") throw new Error("Invalido o ya cobrado.");
      await transferenciasModel.abonarSaldo(cuentaId, simulacion.monto_solicitado);
      await prestamosModel.actualizarEstadoSimulacion(idSolicitud, "DESEMBOLSADO");
      res.status(200).json({ estadoBus: "ESB_CONGELADO_EXITOSO", montoAbonado: parseFloat(simulacion.monto_solicitado) });
    } catch (error) { res.status(500).json({ error: error.message }); }
  }
};
module.exports = prestamosController;