const invModel = require("../models/inversionesModel");
const txModel = require("../models/transferenciasModel");
const inversionesController = {
  aperturarDepositoPlazoFijo: async (req, res) => {
    try {
      const { dni, cuentaId, monto, mesesPlazo } = req.body;
      if (monto < 500) return res.status(400).json({ error: "El monto minimo de apertura es S/. 500.00" });
      await txModel.verificarYDescontar(cuentaId, monto);
      const idInv = "INV-DPF-" + Math.floor(100000 + Math.random() * 900000);
      await invModel.crearInversionSeguro(idInv, dni, `PLAZO_FIJO_${mesesPlazo}_MESES`, monto);
      res.status(200).json({ status: "PLAZO_FIJO_APERTURADO", certificadoId: idInv, treaAplicada: "6.20%" });
    } catch (e) { res.status(400).json({ error: e.message }); }
  },
  suscribirFondosMutuos: async (req, res) => {
    try {
      const { dni, cuentaId, monto, tipoFondo } = req.body; 
      await txModel.verificarYDescontar(cuentaId, monto);
      const idInv = "INV-FM-" + Math.floor(100000 + Math.random() * 900000);
      await invModel.crearInversionSeguro(idInv, dni, `FONDO_MUTUO_${tipoFondo}`, monto);
      res.status(200).json({ status: "CUOTAPARTES_ADQUIRIDAS", fondoId: idInv });
    } catch (e) { res.status(400).json({ error: e.message }); }
  },
  contratarSegurosYRenovacion: async (req, res) => {
    try {
      const { dni, cuentaId, primaMonto, tipoSeguro } = req.body;
      await txModel.verificarYDescontar(cuentaId, primaMonto);
      const idSeg = "SEG-" + Math.floor(100000 + Math.random() * 900000);
      await invModel.crearInversionSeguro(idSeg, dni, tipoSeguro, primaMonto);
      res.status(200).json({ status: "POLIZA_EMITIDA", polizaNumero: idSeg, estado: "VIGENTE_RENOVACION_AUTOMATICA" });
    } catch (e) { res.status(400).json({ error: e.message }); }
  },
  consultarPortafolioYRentabilidad: async (req, res) => {
    try {
      const portafolio = await invModel.obtenerPortafolio(req.query.dni);
      res.status(200).json({ clienteDni: req.query.dni, portafolioActivo: portafolio });
    } catch (e) { res.status(500).json({ error: e.message }); }
  }
};
module.exports = inversionesController;