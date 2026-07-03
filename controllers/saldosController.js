const saldosModel = require("../models/saldosModel");
const saldosController = {
  consultaAhorrosSueldo: async (req, res) => {
    try {
      const cuentas = await saldosModel.obtenerCuentasActivas();
      const enmascaradas = cuentas.map(c => ({ id: c.id, tipo_cuenta: c.tipo_cuenta, saldo: parseFloat(c.saldo_disponible), numeroEnmascarado: "**** " + c.id.slice(-4) }));
      res.status(200).json({ cliente: "JUAN ALEXIS ULLOA TORRES", cuentas: enmascaradas });
    } catch (error) { res.status(500).json({ error: error.message }); }
  },
  obtenerHistorialMovimientos: async (req, res) => {
    try {
      const { cuentaId } = req.query;
      const cuenta = await saldosModel.obtenerCuentaPorId(cuentaId);
      if (!cuenta) return res.status(404).json({ error: "No existe la cuenta" });
      const movimientos = await saldosModel.obtenerMovimientos(cuentaId);
      res.status(200).json({ saldoDisponible: parseFloat(cuenta.saldo_disponible), moneda: cuenta.moneda, movimientos });
    } catch (error) { res.status(500).json({ error: error.message }); }
  }
};
module.exports = saldosController;