const transferenciasModel = require("../models/transferenciasModel");
const transferenciasController = {
  ejecutarTransferenciaPropia: async (req, res) => {
    try {
      const { cuentaOrigen, cuentaDestino, monto } = req.body;
      if (cuentaOrigen === cuentaDestino) throw new Error("Cuentas iguales.");
      await transferenciasModel.descontarSaldo(cuentaOrigen, monto);
      await transferenciasModel.abonarSaldo(cuentaDestino, monto);
      res.status(200).json({ estado: "SUCCESS", voucher: "TRP-" + Math.floor(100000 + Math.random() * 900000) });
    } catch (error) { res.status(500).json({ error: error.message }); }
  },
  evaluarYEnrutarTerceros: async (req, res) => {
    const { cuentaDestino } = req.body;
    const esInterna = cuentaDestino.startsWith("191") || cuentaDestino.startsWith("CTA");
    res.status(200).json({ entidad: esInterna ? "BCP" : "INTERBANCARIO" });
  },
  transferenciaNacional: async (req, res) => {
    try {
      await transferenciasModel.descontarSaldo(req.body.cuentaOrigen, req.body.monto);
      res.status(200).json({ estado: "PROCESADO_CCE" });
    } catch (error) { res.status(500).json({ error: error.message }); }
  }
};
module.exports = transferenciasController;