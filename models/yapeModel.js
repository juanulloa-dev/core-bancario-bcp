const pool = require("../config/db");
const yapeModel = {
  buscarPorCelular: async (celular) => {
    const [rows] = await pool.query("SELECT id FROM cuentas WHERE dni_titular = (SELECT dni FROM usuarios WHERE telefono = ?)", [celular]);
    return rows[0] || null;
  }
};
module.exports = yapeModel;