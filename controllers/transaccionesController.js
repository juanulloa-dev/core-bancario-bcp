const bcpModel = require("../models/bcpModel");

const transaccionesController = {
  // 2. Yape integrado (Integrante 1)
  yapearIntegrado: async (req, res) => {
    const { destinoCelular, monto, cuentaId } = req.body;
    try {
      await bcpModel.descontarSaldo(cuentaId, monto);
      res.status(200).json({ estado: "YAPE_EXITOSO", destino: destinoCelular, montoYapeado: parseFloat(monto), codigoOperacion: "YAPE-" + Math.floor(100000 + Math.random() * 900000) });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // 3. Transferencias Nacionales CCE (Integrante 1)
  transferenciaNacional: async (req, res) => {
    const { cuentaOrigen, cuentaDestino, monto, esInterbancaria } = req.body;
    try {
      await bcpModel.descontarSaldo(cuentaOrigen, monto);
      res.status(200).json({ exito: true, destino: cuentaDestino, comision: esInterbancaria ? 4.50 : 0.00, canal: "Cámara de Compensación Electrónica (CCE)" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // 8. Retiro sin Tarjeta (Integrante 3)
  generarRetiroSinTarjeta: async (req, res) => {
    const { montoARetirar } = req.body;
    if (montoARetirar % 20 !== 0 && montoARetirar % 50 !== 0) {
      return res.status(400).json({ error: "El monto debe ser múltiplo de S/. 20 o S/. 50 para el cajero." });
    }
    res.status(200).json({ exito: true, claveRetiroCajero: Math.floor(1000 + Math.random() * 9000).toString(), expiracionHoras: 2 });
  },

  // 9. Transferencias Internacionales (Integrante 3)
  transferenciaInternacional: async (req, res) => {
    const { swiftCodigo, bancoDestino, montoUsd } = req.body;
    if (!swiftCodigo) return res.status(400).json({ error: "El código SWIFT/BIC es obligatorio para operaciones al exterior." });
    res.status(200).json({ estado: "EN_PROCESO_SWIFT", bancoReceptor: bancoDestino, red: "SWIFT WIRE", gastoTransmision: 20.00 });
  }
};

module.exports = transaccionesController;