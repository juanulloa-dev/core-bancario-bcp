const divisasModel = require("../models/divisasModel");
const txModel = require("../models/transferenciasModel");
const divisasController = {
  simuladorTipoCambio: (req, res) => {
    const tasas = divisasModel.obtenerTipoCambioActual();
    const { monto, operacion } = req.body; // COMPRA o VENTA
    const resultado = operacion === "COMPRA" ? monto / tasas.venta : monto * tasas.compra;
    res.status(200).json({ tasas, montoCalculado: parseFloat(resultado.toFixed(2)) });
  },
  comprarDolares: async (req, res) => {
    try {
      const { cuentaSoles, cuentaDolares, montoSoles } = req.body;
      const tasas = divisasModel.obtenerTipoCambioActual();
      const dolaresAEntregar = montoSoles / tasas.venta;
      await txModel.verificarYDescontar(cuentaSoles, montoSoles);
      await txModel.abonar(cuentaDolares, dolaresAEntregar);
      const v = await txModel.registrarComprobante(cuentaSoles, cuentaDolares, "DIVISAS_COMPRA", montoSoles, `Compra de $ ${dolaresAEntregar.toFixed(2)} a T.C. ${tasas.venta}`);
      res.status(200).json({ status: "CAMBIO_DIVISAS_COMPLETO", dolaresComprados: parseFloat(dolaresAEntregar.toFixed(2)), comprobante: v });
    } catch (e) { res.status(400).json({ error: e.message }); }
  },
  venderDolares: async (req, res) => {
    try {
      const { cuentaDolares, cuentaSoles, montoDolares } = req.body;
      const tasas = divisasModel.obtenerTipoCambioActual();
      const solesAEntregar = montoDolares * tasas.compra;
      await txModel.verificarYDescontar(cuentaDolares, montoDolares);
      await txModel.abonar(cuentaSoles, solesAEntregar);
      const v = await txModel.registrarComprobante(cuentaDolares, cuentaSoles, "DIVISAS_VENTA", montoDolares, `Venta de $ ${montoDolares} recibiendo S/. ${solesAEntregar.toFixed(2)}`);
      res.status(200).json({ status: "CAMBIO_DIVISAS_COMPLETO", solesEntregados: parseFloat(solesAEntregar.toFixed(2)), comprobante: v });
    } catch (e) { res.status(400).json({ error: e.message }); }
  }
};
module.exports = divisasController;