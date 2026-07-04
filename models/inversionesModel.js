const pool = require("../config/db");
const inversionesModel = {
  crearInversionSeguro: async (id, dni, tipo, monto) => {
    await pool.query("INSERT INTO inversiones_seguros (id_producto, dni_cliente, tipo_producto, monto_invertido_prima) VALUES (?,?,?,?)", [id, dni, tipo, monto]);
  },
  obtenerPortafolio: async (dni) => {
    const [rows] = await pool.query("SELECT * FROM inversiones_seguros WHERE dni_cliente = ?", [dni]);
    return rows;
  }
};
module.exports = inversionesModel;