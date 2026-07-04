const pool = require("../config/db");
const cuentasModel = {
  obtenerCuentasPorDni: async (dni) => {
    const [rows] = await pool.query("SELECT * FROM cuentas WHERE dni_titular = ?", [dni]);
    return rows;
  },
  obtenerTarjetasPorCuenta: async (cuentaId) => {
    const [rows] = await pool.query("SELECT * FROM tarjetas WHERE cuenta_id = ?", [cuentaId]);
    return rows;
  },
  obtenerMovimientos: async (cuentaId) => {
    const [rows] = await pool.query("SELECT * FROM historial_transacciones WHERE cuenta_origen = ? OR cuenta_destino = ? ORDER BY fecha_registro DESC", [cuentaId, cuentaId]);
    return rows;
  }
};
module.exports = cuentasModel;