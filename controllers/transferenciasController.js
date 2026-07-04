const txModel = require("../models/transferenciasModel");
const txController = {
  transferenciaPropia: async (req, res) => {
    try {
      const { origen, destino, monto } = req.body;
      await txModel.verificarYDescontar(origen, monto);
      await txModel.abonar(destino, monto);
      const vouch = await txModel.registrarComprobante(origen, destino, "TR_PROPIA", monto, "Transferencia entre cuentas del mismo titular");
      res.status(200).json({ status: "SUCCESS", comprobante: vouch });
    } catch (e) { res.status(400).json({ error: e.message }); }
  },
  transferenciaTercerosBCP: async (req, res) => {
    try {
      const { origen, destino, monto, concepto } = req.body;
      await txModel.verificarYDescontar(origen, monto);
      await txModel.abonar(destino, monto);
      const vouch = await txModel.registrarComprobante(origen, destino, "TR_TERCEROS", monto, concepto);
      res.status(200).json({ status: "SUCCESS", beneficiario: "Usuario BCP Afiliado", comprobante: vouch });
    } catch (e) { res.status(400).json({ error: e.message }); }
  },
  transferenciaOtrosBancosCCE: async (req, res) => {
    try {
      const { origen, cciDestino, monto, tipoEnvio } = req.body; // Inmediata o Diferida
      await txModel.verificarYDescontar(origen, monto);
      const vouch = await txModel.registrarComprobante(origen, cciDestino, "TR_OTROS_BANCOS", monto, `Envio interbancario via CCE (${tipoEnvio})`);
      res.status(200).json({ status: "PROCESANDO_CAMARA", mensaje: "Fondos retenidos para liquidación interbancaria", comprobante: vouch });
    } catch (e) { res.status(400).json({ error: e.message }); }
  },
  transferenciaInternacional: async (req, res) => {
    try {
      const { origen, swiftCodigo, cuentaInternacional, monto, pais } = req.body;
      await txModel.verificarYDescontar(origen, monto);
      const vouch = await txModel.registrarComprobante(origen, cuentaInternacional, "TR_INTERNACIONAL", monto, `Giro al exterior SWIFT a ${pais}`);
      res.status(200).json({ status: "SWIFT_PENDING", comisionSwift: "S/. 55.00", comprobante: vouch });
    } catch (e) { res.status(400).json({ error: e.message }); }
  },
  programarTransferencia: async (req, res) => {
    res.status(200).json({ msg: "Transferencia programada con éxito", ejecucion: "Todos los 25 de cada mes" });
  }
};
module.exports = txController;