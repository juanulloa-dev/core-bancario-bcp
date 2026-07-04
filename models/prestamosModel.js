const pool = require("../config/db");
const prestamosModel = {
  registrarSimulacion: async (id, monto, cuotas, tcea, cuota) => {
    await pool.query("INSERT INTO simulaciones_credito VALUES (?, ?, ?, ?, ?, 'SIMULADO_ONLINE')", [id, monto, cuotas, tcea, cuota]);
  },
  obtenerSimulacion: async (id) => {
    const [rows] = await pool.query("SELECT * FROM simulaciones_credito WHERE id_solicitud = ?", [id]);
    return rows[0] || null;
  },
  actualizarEstadoSimulacion: async (id, estado) => {
    await pool.query("UPDATE simulaciones_credito SET estado_solicitud = ? WHERE id_solicitud = ?", [estado, id]);
  },
  crearPrestamoVigente: async (id, dni, monto, cuotas, cuotaMonto) => {
    await pool.query("INSERT INTO prestamos (id_prestamo, dni_cliente, monto_capital, cuotas_totales, monto_cuota) VALUES (?,?,?,?,?)", [id, dni, monto, cuotas, cuotaMonto]);
  },
  obtenerPrestamosCliente: async (dni) => {
    const [rows] = await pool.query("SELECT * FROM prestamos WHERE dni_cliente = ?", [dni]);
    return rows;
  },
  pagarCuotaModelo: async (idPrestamo, cuotasAPagar) => {
    await pool.query("UPDATE prestamos SET cuotas_pagadas = cuotas_pagadas + ? WHERE id_prestamo = ?", [cuotasAPagar, idPrestamo]);
  }
};
module.exports = prestamosModel;