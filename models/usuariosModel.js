const pool = require("../config/db");

const usuariosModel = {
  // Buscar un usuario con credenciales de la App real
  validarCredenciales: async (numeroTarjeta, clave, dni) => {
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE numero_tarjeta = ? AND clave = ? AND dni = ?",
      [numeroTarjeta, clave, dni]
    );
    return rows[0] || null;
  },

  // Registrar auditoría en la BD (Regla del servicio S001)
  registrarAuditoria: async (dni, accion) => {
    await pool.query(
      "INSERT INTO auditoria_accesos (username, accion) VALUES (?, ?)",
      [dni, accion]
    );
  }
};

module.exports = usuariosModel;