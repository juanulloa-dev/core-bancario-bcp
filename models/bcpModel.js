const pool = require("../config/db");

const bcpModel = {
  obtenerCuentas: async () => {
    const [rows] = await pool.query("SELECT * FROM cuentas");
    return rows;
  },

  actualizarConfigTarjeta: async (idTarjeta, internet, extranjero) => {
    await pool.query(
      "UPDATE tarjetas_config SET compras_internet = ?, compras_extranjero = ? WHERE id_tarjeta = ?",
      [internet ? 1 : 0, extranjero ? 1 : 0, idTarjeta]
    );
  },

  actualizarPin: async (idTarjeta, nuevoPin) => {
    await pool.query("UPDATE tarjetas_config SET pin_cajero = ? WHERE id_tarjeta = ?", [nuevoPin, idTarjeta]);
  },

  descontarSaldo: async (cuentaId, monto) => {
    await pool.query("UPDATE cuentas SET saldo_disponible = saldo_disponible - ? WHERE id = ?", [monto, cuentaId]);
  },

  // NUEVO: Lógica SQL para Wawaditos (Integrante 3)
  operarWawaditos: async (cuentaId, monto, operacion) => {
    if (operacion === "AHORRAR") {
      await pool.query(
        "UPDATE cuentas SET saldo_disponible = saldo_disponible - ?, saldo_wawaditos = saldo_wawaditos + ? WHERE id = ?",
        [monto, monto, cuentaId]
      );
    } else {
      await pool.query(
        "UPDATE cuentas SET saldo_disponible = saldo_disponible + ?, saldo_wawaditos = saldo_wawaditos - ? WHERE id = ?",
        [monto, monto, cuentaId]
      );
    }
  },

  // NUEVO: Obtener deuda de Luz/Agua de MySQL (Integrante 4)
  obtenerDeudaServicio: async (idServicio) => {
    const [rows] = await pool.query("SELECT * FROM servicios_publicos WHERE id_servicio = ?", [idServicio]);
    if (rows.length === 0) throw new Error("Servicio no encontrado o ya pagado.");
    return rows[0];
  },

  // NUEVO: Cambiar estado de compra en tarjeta (Integrante 4)
  actualizarEstadoCompra: async (idCompra, nuevoEstado) => {
    await pool.query("UPDATE compras_tarjeta SET estado = ? WHERE id_compra = ?", [nuevoEstado, idCompra]);
  }
};

module.exports = bcpModel;