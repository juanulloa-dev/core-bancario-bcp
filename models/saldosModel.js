const pool = require("../config/db");
const saldosModel = {
  obtenerCuentasActivas: async () => {
    const [rows] = await pool.query("SELECT * FROM cuentas WHERE estado = 'ACTIVO'");
    return rows;
  },
  obtenerCuentaPorId: async (cuentaId) => {
    const [rows] = await pool.query("SELECT * FROM cuentas WHERE id = ?", [cuentaId]);
    return rows[0] || null;
  },
  obtenerMovimientos: async (cuentaId) => {
    const [rows] = await pool.query("SELECT id_movimiento as id, detalle, monto, fecha_registro as fecha FROM historial_movimientos WHERE cuenta_id = ? ORDER BY fecha_registro DESC LIMIT 20", [cuentaId]);
    return rows;
  }
};
module.exports = saldosModel;