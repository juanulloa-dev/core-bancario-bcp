const pool = require("../config/db");
const pagosModel = {
  obtenerDeudaServicio: async (idServicio) => {
    const [rows] = await pool.query("SELECT * FROM servicios_publicos WHERE id_servicio = ?", [idServicio]);
    return rows[0] || null;
  },
  actualizarEstadoCompra: async (idCompra, nuevoEstado) => {
    await pool.query("UPDATE compras_tarjeta SET estado = ? WHERE id_compra = ?", [nuevoEstado, idCompra]);
  }
};
module.exports = pagosModel;