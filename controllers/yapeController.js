const transferenciasModel = require("../models/transferenciasModel");
const yapeModel = require("../models/yapeModel");
const yapeController = {
  yapearIntegrable: async (req, res) => {
    try {
      const { destinoCelular, monto, cuentaId } = req.body;
      if (!/^[0-9]{9}$/.test(destinoCelular)) throw new Error("Móvil inválido.");
      await transferenciasModel.descontarSaldo(cuentaId, monto);
      res.status(200).json({ estado: "YAPE_EXITOSO", montoYapeado: parseFloat(monto) });
    } catch (error) { res.status(500).json({ error: error.message }); }
  },
  gestionarWardaditos: async (req, res) => {
    try {
      const { monto, operacion, cuentaId } = req.body;
      await yapeModel.operarWardaditos(cuentaId, monto, operacion);
      res.status(200).json({ exito: true, mensaje: `Wardaditos (${operacion}) procesado.` });
    } catch (error) { res.status(500).json({ error: error.message }); }
  }
};
module.exports = yapeController;