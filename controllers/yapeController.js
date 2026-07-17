const yapeModel = require("../models/yapeModel");
const txModel = require("../models/transferenciasModel");
const divisasModel = require("../models/divisasModel"); // Importamos para usar las tasas de la mesa de cambio
const pool = require("../config/db"); // Requerido para verificar los tipos de cuenta reales en BD

const yapeController = {
  vincularYapeBCP: async (req, res) => {
    res.status(200).json({ yapeStatus: "VINCULADO", limiteDiario: 500 });
  },

  enviarDineroYape: async (req, res) => {
    try {
      const { cuentaId, celularDestino, monto } = req.body;
      const mtoNum = parseFloat(monto);

      // 1. Buscamos el destino por el número de celular
      const destino = await yapeModel.buscarPorCelular(celularDestino);
      if (!destino) return res.status(404).json({ error: "El celular no está registrado en Yape/Plin" });

      // 2. Consultamos los tipos de cuenta en la BD para analizar las monedas
      const [origenData] = await pool.query("SELECT tipo_cuenta FROM cuentas WHERE id = ?", [cuentaId]);
      const [destinoData] = await pool.query("SELECT tipo_cuenta FROM cuentas WHERE id = ?", [destino.id]);
      
      const esOrigenDolares = origenData[0].tipo_cuenta.includes('DOL');
      const esDestinoDolares = destinoData[0].tipo_cuenta.includes('DOL');
      
      let montoAEntregar = mtoNum;
      let detalleCambio = "Yape instantáneo";

      // 3. Lógica Automática de Conversión de Divisas para Yape
      if (esOrigenDolares && !esDestinoDolares) {
        // Yapeas Dólares a una cuenta en Soles (El banco te compra los dólares)
        const tasas = divisasModel.obtenerTipoCambioActual();
        montoAEntregar = mtoNum * tasas.compra; 
        detalleCambio = `Yape Cambios: $${mtoNum.toFixed(2)} convertido a S/.${montoAEntregar.toFixed(2)} (T.C. ${tasas.compra})`;
      } else if (!esOrigenDolares && esDestinoDolares) {
        // Yapeas Soles a una cuenta en Dólares (El banco te vende los dólares)
        const tasas = divisasModel.obtenerTipoCambioActual();
        montoAEntregar = mtoNum / tasas.venta;
        detalleCambio = `Yape Cambios: S/.${mtoNum.toFixed(2)} convertido a $${montoAEntregar.toFixed(2)} (T.C. ${tasas.venta})`;
      }

      // 4. Ejecutamos los descuentos y abonos correspondientes con el monto calculado
      await txModel.verificarYDescontar(cuentaId, mtoNum);
      await txModel.abonar(destino.id, montoAEntregar);
      
      const v = await txModel.registrarComprobante(cuentaId, destino.id, "YAPE", mtoNum, detalleCambio);
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