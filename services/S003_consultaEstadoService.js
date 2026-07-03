const pool = require("../config/db");

const S003_consultaEstadoService = {
  obtenerMovimientos: async (cuentaId) => {
    // Consulta real a la tabla de historial de movimientos de MySQL
    const [movimientos] = await pool.query(
      "SELECT id_movimiento as id, detalle, monto, fecha_registro as fecha FROM historial_movimientos WHERE cuenta_id = ? ORDER BY fecha_registro DESC LIMIT 20", 
      [cuentaId]
    );
    const [cuenta] = await pool.query("SELECT saldo_disponible FROM cuentas WHERE id = ?", [cuentaId]);
    
    if (cuenta.length === 0) throw new Error("La cuenta elegida no existe.");
    
    return {
      saldoDisponible: cuenta[0].saldo_disponible,
      moneda: "PEN",
      movimientos
    };
  }
};
module.exports = S003_consultaEstadoService;