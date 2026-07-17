const pool = require("../config/db");

const transferenciasModel = {
  verificarYDescontar: async (cuentaId, monto) => {
    const [rows] = await pool.query("SELECT saldo_disponible FROM cuentas WHERE id = ?", [cuentaId]);
    if (!rows[0] || rows[0].saldo_disponible < monto) throw new Error("Fondos insuficientes");
    await pool.query("UPDATE cuentas SET saldo_disponible = saldo_disponible - ? WHERE id = ?", [monto, cuentaId]);
  },

  validarExistenciaDestino: async (cuentaId) => {
    const [rows] = await pool.query("SELECT id FROM cuentas WHERE id = ?", [cuentaId]);
    if (!rows[0]) throw new Error("La cuenta de destino BCP especificada no existe.");
  },

  abonar: async (cuentaId, monto) => {
    await pool.query("UPDATE cuentas SET saldo_disponible = saldo_disponible + ? WHERE id = ?", [monto, cuentaId]);
  },

  // CORREGIDO: Ahora recibe el parámetro "moneda" y lo inserta en el query
  registrarComprobante: async (origen, destino, tipo, monto, detalle, moneda) => {
    const compId = "VOUCH-" + Math.floor(100000 + Math.random() * 900000);
    await pool.query(
      "INSERT INTO historial_transacciones (cuenta_origen, cuenta_destino, tipo_operacion, monto, moneda, detalle, comprobante_id) VALUES (?,?,?,?,?,?,?)", 
      [origen, destino, tipo, monto, moneda, detalle, compId]
    );
    return compId;
  }
};

module.exports = transferenciasModel;