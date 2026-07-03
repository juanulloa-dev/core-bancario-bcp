const pool = require("../config/db");
const transferenciasModel = {
  descontarSaldo: async (cuentaId, monto) => {
    const [cuenta] = await pool.query("SELECT saldo_disponible FROM cuentas WHERE id = ?", [cuentaId]);
    if (!cuenta[0] || cuenta[0].saldo_disponible < monto) throw new Error("Fondos insuficientes.");
    await pool.query("UPDATE cuentas SET saldo_disponible = saldo_disponible - ? WHERE id = ?", [monto, cuentaId]);
  },
  abonarSaldo: async (cuentaId, monto) => {
    await pool.query("UPDATE cuentas SET saldo_disponible = saldo_disponible + ? WHERE id = ?", [monto, cuentaId]);
  }
};
module.exports = transferenciasModel;