const S004 = require("../services/S004_transferenciaPropiaService");
const S005 = require("../services/S005_enrutamientoTransfService");
const S006 = require("../services/S006_transferenciaTercerosService");
const S007 = require("../services/S007_transferenciaCelularService");

const transaccionesController = {
  yapearIntegrable: async (req, res) => {
    try {
      // S007: Transferencia Celular Interoperable
      const { destinoCelular, monto, cuentaId } = req.body;
      const data = await S007.yapearCelular(destinoCelular, cuentaId, monto);
      res.status(200).json(data);
    } catch (error) { res.status(500).json({ error: error.message }); }
  },
  ejecutarTransferenciaPropia: async (req, res) => {
    try {
      // S004: Ejecución de Transferencia Propia
      const { cuentaOrigen, cuentaDestino, monto } = req.body;
      const data = await S004.transferirMismoTitular(cuentaOrigen, cuentaDestino, monto);
      res.status(200).json(data);
    } catch (error) { res.status(500).json({ error: error.message }); }
  },
  evaluarYEnrutarTerceros: async (req, res) => {
    try {
      // S005: Enrutamiento e Inicio de Transferencia
      const data = await S005.evaluarCuentaDestino(req.body.cuentaDestino);
      res.status(200).json(data);
    } catch (error) { res.status(500).json({ error: error.message }); }
  },
  transferenciaNacional: async (req, res) => {
    try {
      // S006: Ejecutar Transferencia Terceros (CCE)
      const { cuentaOrigen, cuentaDestino, monto } = req.body;
      const data = await S006.ejecutarEnvioTerceros(cuentaOrigen, cuentaDestino, monto);
      res.status(200).json(data);
    } catch (error) { res.status(500).json({ error: error.message }); }
  },
  generarRetiroSinTarjeta: async (req, res) => {
    res.status(200).json({ exito: true, claveRetiroCajero: Math.floor(1000 + Math.random() * 9000).toString(), expiracionHoras: 2 });
  },
  transferenciaInternacional: async (req, res) => {
    res.status(200).json({ estado: "EN_PROCESO_SWIFT", red: "SWIFT WIRE", gastoTransmision: 20.00 });
  }
};
module.exports = transaccionesController;