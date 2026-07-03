const pool = require("../config/db");
const yapeModel = {
  operarWardaditos: async (cuentaId, monto, operacion) => {
    if (operacion === "GUARDAR") {
      await pool.query("UPDATE cuentas SET saldo_disponible = saldo_disponible - ?, saldo_wawaditos = saldo_wawaditos + ? WHERE id = ?", [monto, monto, cuentaId]);
    } else {
      await pool.query("UPDATE cuentas SET saldo_disponible = saldo_disponible + ?, saldo_wawaditos = saldo_wawaditos - ? WHERE id = ?", [monto, monto, cuentaId]);
    }
  }
};
module.exports = yapeModel;