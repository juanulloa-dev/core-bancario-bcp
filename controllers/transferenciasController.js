const txModel = require("../models/transferenciasModel");
const divisasModel = require("../models/divisasModel"); 
const pool = require("../config/db"); 

const txController = {
  transferenciaPropia: async (req, res) => {
    try {
      const { origen, destino, monto } = req.body;
      const mtoNum = parseFloat(monto);

      const [origenData] = await pool.query("SELECT tipo_cuenta FROM cuentas WHERE id = ?", [origen]);
      const [destinoData] = await pool.query("SELECT tipo_cuenta FROM cuentas WHERE id = ?", [destino]);
      
      const esOrigenDolares = origenData[0].tipo_cuenta.includes('DOL');
      const esDestinoDolares = destinoData[0].tipo_cuenta.includes('DOL');
      
      let montoAEntregar = mtoNum;
      let detalleCambio = "Transferencia entre cuentas del mismo titular";
      let monedaDestino = esDestinoDolares ? 'USD' : 'PEN';

      if (esOrigenDolares && !esDestinoDolares) {
        const tasas = divisasModel.obtenerTipoCambioActual();
        montoAEntregar = mtoNum * tasas.compra; 
        detalleCambio = `Compra Divisas: $${mtoNum.toFixed(2)} a S/.${montoAEntregar.toFixed(2)} (T.C. ${tasas.compra})`;
      } else if (!esOrigenDolares && esDestinoDolares) {
        const tasas = divisasModel.obtenerTipoCambioActual();
        montoAEntregar = mtoNum / tasas.venta;
        detalleCambio = `Venta Divisas: S/.${mtoNum.toFixed(2)} a $${montoAEntregar.toFixed(2)} (T.C. ${tasas.venta})`;
      }

      await txModel.verificarYDescontar(origen, mtoNum);
      await txModel.abonar(destino, montoAEntregar);
      
      // CORREGIDO: Enviamos monto final y tipo de moneda destino
      const vouch = await txModel.registrarComprobante(origen, destino, "TR_PROPIA", montoAEntregar, detalleCambio, monedaDestino);
      res.status(200).json({ status: "SUCCESS", comprobante: vouch, mensaje: detalleCambio });
    } catch (e) { res.status(400).json({ error: e.message }); }
  },

  transferenciaTercerosBCP: async (req, res) => {
      try {
        const { origen, destino, monto, concepto } = req.body;
        const mtoNum = parseFloat(monto);
          
        await txModel.validarExistenciaDestino(destino);
        
        const [origenData] = await pool.query("SELECT tipo_cuenta FROM cuentas WHERE id = ?", [origen]);
        const [destinoData] = await pool.query("SELECT tipo_cuenta FROM cuentas WHERE id = ?", [destino]);
        
        const esOrigenDolares = origenData[0].tipo_cuenta.includes('DOL');
        const esDestinoDolares = destinoData[0].tipo_cuenta.includes('DOL');
        
        let montoAEntregar = mtoNum;
        let detalleCambio = concepto || "Transferencia a Tercero";
        
        // SOLUCIÓN DEFINITIVA: Registramos la moneda real de la cuenta de origen (USD)
        let monedaOrigen = esOrigenDolares ? 'USD' : 'PEN'; 

        if (esOrigenDolares && !esDestinoDolares) {
          const tasas = divisasModel.obtenerTipoCambioActual();
          montoAEntregar = mtoNum * tasas.compra; 
          detalleCambio = `Conversión: $${mtoNum.toFixed(2)} a S/.${montoAEntregar.toFixed(2)} (T.C. ${tasas.compra})`;
        } else if (!esOrigenDolares && esDestinoDolares) {
          const tasas = divisasModel.obtenerTipoCambioActual();
          montoAEntregar = mtoNum / tasas.venta;
          detalleCambio = `Conversión: S/.${mtoNum.toFixed(2)} a $${montoAEntregar.toFixed(2)} (T.C. ${tasas.venta})`;
        }

        await txModel.verificarYDescontar(origen, mtoNum);
        await txModel.abonar(destino, montoAEntregar);
        
        // PASAMOS "mtoNum" (10.00) y "monedaOrigen" (USD) para que guarde los dólares planos enviados
        const vouch = await txModel.registrarComprobante(origen, destino, "TR_TERCEROS", mtoNum, detalleCambio, monedaOrigen);
        
        res.status(200).json({ 
          status: "SUCCESS", 
          beneficiario: "Usuario BCP Afiliado", 
          comprobante: vouch,
          mensaje: detalleCambio
        });
      } catch (e) { res.status(400).json({ error: e.message }); }
    },

  transferenciaOtrosBancosCCE: async (req, res) => {
    try {
      const { origen, cciDestino, monto, tipoEnvio } = req.body;
      const mtoNum = parseFloat(monto);

      const [origenData] = await pool.query("SELECT tipo_cuenta FROM cuentas WHERE id = ?", [origen]);
      const esOrigenDolares = origenData[0].tipo_cuenta.includes('DOL');

      let montoFinalDescontado = mtoNum;
      let detalleInterbancario = `Envio interbancario via CCE (${tipoEnvio})`;
      let monedaDestino = 'PEN'; // La cámara interbancaria nacional liquida en soles por defecto para estos CCIs

      if (esOrigenDolares) {
        const tasas = divisasModel.obtenerTipoCambioActual();
        montoFinalDescontado = mtoNum * tasas.compra;
        detalleInterbancario = `Envio CCE de $${mtoNum.toFixed(2)} convertido a S/.${montoFinalDescontado.toFixed(2)} (T.C. ${tasas.compra})`;
      }

      await txModel.verificarYDescontar(origen, mtoNum);
      
      // CORREGIDO: Enviamos monto convertido y moneda correspondiente
      const vouch = await txModel.registrarComprobante(origen, cciDestino, "TR_OTROS_BANCOS", montoFinalDescontado, detalleInterbancario, monedaDestino);
      res.status(200).json({ status: "PROCESANDO_CAMARA", mensaje: detalleInterbancario, comprobante: vouch });
    } catch (e) { res.status(400).json({ error: e.message }); }
  },

  transferenciaInternacional: async (req, res) => {
    try {
      const { origen, swiftCodigo, cuentaInternacional, monto, pais } = req.body;
      const [origenData] = await pool.query("SELECT tipo_cuenta FROM cuentas WHERE id = ?", [origen]);
      const esOrigenDolares = origenData[0].tipo_cuenta.includes('DOL');
      
      await txModel.verificarYDescontar(origen, monto);
      
      // CORREGIDO: Registra usando la moneda original de la cuenta origen para transacciones SWIFT exteriores
      const vouch = await txModel.registrarComprobante(origen, cuentaInternacional, "TR_INTERNACIONAL", monto, `Giro al exterior SWIFT a ${pais}`, esOrigenDolares ? 'USD' : 'PEN');
      res.status(200).json({ status: "SWIFT_PENDING", comisionSwift: "S/. 55.00", comprobante: vouch });
    } catch (e) { res.status(400).json({ error: e.message }); }
  },

  programarTransferencia: async (req, res) => {
    res.status(200).json({ msg: "Transferencia programada con éxito", ejecucion: "Todos los 25 de cada mes" });
  }
};

module.exports = txController;