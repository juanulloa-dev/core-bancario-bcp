const cuentasModel = require("../models/cuentasModel");
const cuentasController = {
  verCuentasYSaldos: async (req, res) => {
    try {
      const cuentas = await cuentasModel.obtenerCuentasPorDni(req.query.dni);
      res.status(200).json({ cuentas });
    } catch (e) { res.status(500).json({ error: e.message }); }
  },
  verDetalleYCCI: async (req, res) => {
    try {
      const cuentas = await cuentasModel.obtenerCuentasPorDni(req.query.dni);
      const mapeadas = cuentas.map(c => ({ cuenta: c.id, cci: c.cci, estado: c.estado, moneda: c.tipo_cuenta.includes('DOL') ? 'USD' : 'PEN' }));
      res.status(200).json(mapeadas);
    } catch (e) { res.status(500).json({ error: e.message }); }
  },
  verTarjetasCreditoDebito: async (req, res) => {
    try {
      const { cuentaId } = req.query;
      const tarjetas = await cuentasModel.obtenerTarjetasPorCuenta(cuentaId);
      res.status(200).json(tarjetas);
    } catch (e) { res.status(500).json({ error: e.message }); }
  },
  verMovimientosEstadoCuenta: async (req, res) => {
    try {
      const movimientos = await cuentasModel.obtenerMovimientos(req.query.cuentaId);
      res.status(200).json({ idEstadoCuenta: "EC-2026-07", movimientos });
    } catch (e) { res.status(500).json({ error: e.message }); }
  }
};
module.exports = cuentasController;