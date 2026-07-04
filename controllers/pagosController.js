const pagosModel = require("../models/pagosModel");
const txModel = require("../models/transferenciasModel");
const pagosController = {
  pagoServiciosPublicos: async (req, res) => {
    try {
      const { idEmpresa, cuentaId } = req.body;
      const empresa = await pagosModel.consultarEmpresa(idEmpresa);
      if (!empresa || empresa.monto_deuda <= 0) return res.status(400).json({ msg: "No registra deudas pendientes" });
      await txModel.verificarYDescontar(cuentaId, empresa.monto_deuda);
      await pagosModel.liquidarDeudaEmpresa(idEmpresa);
      const v = await txModel.registrarComprobante(cuentaId, idEmpresa, "PAGO_SERVICIO", empresa.monto_deuda, `Pago de recibo ${empresa.nombre_empresa}`);
      res.status(200).json({ status: "RECIBO_PAGADO", empresa: empresa.nombre_empresa, total: empresa.monto_deuda, comprobante: v });
    } catch (e) { res.status(400).json({ error: e.message }); }
  },
  recargasCelularOperadoras: async (req, res) => {
    try {
      const { cuentaId, operadoraId, numeroCelular, monto } = req.body;
      await txModel.verificarYDescontar(cuentaId, monto);
      const v = await txModel.registrarComprobante(cuentaId, operadoraId, "RECARGA", monto, `Recarga de saldo al numero ${numeroCelular}`);
      res.status(200).json({ status: "RECARGA_EXITOSA", numero: numeroCelular, montoRecargado: monto, comprobante: v });
    } catch (e) { res.status(400).json({ error: e.message }); }
  },
  pagoTarjetaCreditoBCP: async (req, res) => {
    try {
      const { cuentaId, idTarjeta, montoAPagar } = req.body; // Pago Minimo, Total o Parcial
      await txModel.verificarYDescontar(cuentaId, montoAPagar);
      await pagosModel.descontarDeudaTarjeta(idTarjeta, montoAPagar);
      const v = await txModel.registrarComprobante(cuentaId, idTarjeta, "PAGO_TARJETA", montoAPagar, "Abono directo a deuda de Tarjeta de Credito BCP");
      res.status(200).json({ status: "TARJETA_PAGADA_EXITO", comprobante: v });
    } catch (e) { res.status(400).json({ error: e.message }); }
  },
  pagoTarjetaOtrosBancos: async (req, res) => {
    try {
      const { cuentaId, numeroTarjetaDestino, bancoDestino, monto } = req.body;
      await txModel.verificarYDescontar(cuentaId, monto);
      const v = await txModel.registrarComprobante(cuentaId, numeroTarjetaDestino, "PAGO_TARJETA_OTROS", monto, `Pago de tarjeta interbancaria hacia ${bancoDestino}`);
      res.status(200).json({ status: "TRANSMISION_CCE_OK", mensaje: "El abono se reflejará en el banco destino en el lapso del horario seleccionado", comprobante: v });
    } catch (e) { res.status(400).json({ error: e.message }); }
  }
};
module.exports = pagosController;