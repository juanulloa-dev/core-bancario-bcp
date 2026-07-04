const prestamosModel = require("../models/prestamosModel");
const txModel = require("../models/transferenciasModel");
const prestamosController = {
  simularCreditoCampaña: async (req, res) => {
    try {
      const { montoSolicitado, cuotas } = req.body;
      const tcea = 45.50;
      const cuotaMensual = Math.round(((montoSolicitado * 1.45) / cuotas) * 100) / 100;
      const idSolicitud = "SOL-" + Math.floor(100000 + Math.random() * 900000);
      await prestamosModel.registrarSimulacion(idSolicitud, montoSolicitado, cuotas, tcea, cuotaMensual);
      res.status(200).json({ idSolicitud, montoCuotaEstimada: cuotaMensual, tceaAplicada: `${tcea}%` });
    } catch (e) { res.status(500).json({ error: e.message }); }
  },
  desembolsarPréstamoOnline: async (req, res) => {
    try {
      const { idSolicitud, cuentaId, dniCliente } = req.body;
      const sim = await prestamosModel.obtenerSimulacion(idSolicitud);
      if (!sim || sim.estado_solicitud === "DESEMBOLSADO") throw new Error("Invalido o ya cobrado.");
      await txModel.abonar(cuentaId, sim.monto_solicitado);
      await prestamosModel.actualizarEstadoSimulacion(idSolicitud, "DESEMBOLSADO");
      await prestamosModel.crearPrestamoVigente(idSolicitud, dniCliente, sim.monto_solicitado, sim.cuotas_pactadas, sim.monto_cuota);
      res.status(200).json({ estadoBus: "ESB_CONGELADO_EXITOSO", montoAbonado: parseFloat(sim.monto_solicitado) });
    } catch (e) { res.status(400).json({ error: e.message }); }
  },
  verCronogramaYPrestamos: async (req, res) => {
    try {
      const listado = await prestamosModel.obtenerPrestamosCliente(req.query.dni);
      res.status(200).json(listado);
    } catch (e) { res.status(500).json({ error: e.message }); }
  },
  pagarOAdelantarCuotas: async (req, res) => {
    try {
      const { idPrestamo, cuentaId, numeroCuotas, montoTotalCuotas } = req.body;
      await txModel.verificarYDescontar(cuentaId, montoTotalCuotas);
      await prestamosModel.pagarCuotaModelo(idPrestamo, numeroCuotas);
      const v = await txModel.registrarComprobante(cuentaId, idPrestamo, "PAGO_PRESTAMO", montoTotalCuotas, `Amortización de ${numeroCuotas} cuotas del credito`);
      res.status(200).json({ status: "CUOTA_AMORTIZADA", comprobante: v });
    } catch (e) { res.status(400).json({ error: e.message }); }
  }
};
module.exports = prestamosController;