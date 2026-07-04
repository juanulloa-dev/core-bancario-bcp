const yapeModel = require("../models/yapeModel");
const txModel = require("../models/transferenciasModel");
const yapeController = {
  vincularYapeBCP: async (req, res) => {
    res.status(200).json({ yapeStatus: "VINCULADO", limiteDiario: 500 });
  },
  enviarDineroYape: async (req, res) => {
    try {
      const { cuentaId, celularDestino, monto } = req.body;
      const destino = await yapeModel.buscarPorCelular(celularDestino);
      if (!destino) return res.status(404).json({ error: "El celular no está registrado en Yape/Plin" });
      await txModel.verificarYDescontar(cuentaId, monto);
      await txModel.abonar(destino.id, monto);
      const v = await txModel.registrarComprobante(cuentaId, destino.id, "YAPE", monto, "Yape instantáneo");
      res.status(200).json({ status: "SUCCESS", voucher: v });
    } catch (e) { res.status(400).json({ error: e.message }); }
  },
  generarCobroQR: async (req, res) => {
    const stringQR = "BCP-QR-PAYMENT-" + Math.random().toString(36).substring(7);
    res.status(200).json({ qrBase64Simulado: "data:image/png;base64...", payload: stringQR });
  },
  escanearYPagosQR: async (req, res) => {
    try {
      const { cuentaId, payloadQR, monto } = req.body;
      await txModel.verificarYDescontar(cuentaId, monto);
      const v = await txModel.registrarComprobante(cuentaId, "COMERCIO-QR", "QR_PAGO", monto, "Pago escaneado con QR");
      res.status(200).json({ status: "PAGO_QR_ACEPTADO", comprobante: v });
    } catch (e) { res.status(400).json({ error: e.message }); }
  },
  desvincularYape: async (req, res) => {
    res.status(200).json({ yapeStatus: "DESVINCULADO", msg: "Cuenta desvinculada del servicio Yape" });
  }
};
module.exports = yapeController;