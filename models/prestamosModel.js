const pool = require("../config/db");
const prestamosModel = {
  registrarSimulacion: async (idSolicitud, monto, cuotas, tcea, cuotaMensual) => {
    await pool.query("INSERT INTO simulaciones_credito (id_solicitud, monto_solicitado, cuotas_pactadas, tcea_aplicada, monto_cuota, estado_solicitud) VALUES (?, ?, ?, ?, ?, 'SIMULADO_ONLINE')", [idSolicitud, monto, cuotas, tcea, cuotaMensual]);
  },
  obtenerSimulacion: async (idSolicitud) => {
    const [rows] = await pool.query("SELECT * FROM simulaciones_credito WHERE id_solicitud = ?", [idSolicitud]);
    return rows[0] || null;
  },
  actualizarEstadoSimulacion: async (idSolicitud, nuevoEstado) => {
    await pool.query("UPDATE simulaciones_credito SET estado_solicitud = ? WHERE id_solicitud = ?", [nuevoEstado, idSolicitud]);
  }
};
module.exports = prestamosModel;