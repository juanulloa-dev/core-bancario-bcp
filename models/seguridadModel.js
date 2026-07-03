const pool = require("../config/db");
const seguridadModel = {
  actualizarConfigTarjeta: async (idTarjeta, internet, extranjero) => {
    await pool.query("UPDATE tarjetas_config SET compras_internet = ?, compras_extranjero = ? WHERE id_tarjeta = ?", [internet ? 1 : 0, extranjero ? 1 : 0, idTarjeta]);
  },
  actualizarPin: async (idTarjeta, nuevoPin) => {
    await pool.query("UPDATE tarjetas_config SET pin_cajero = ? WHERE id_tarjeta = ?", [nuevoPin, idTarjeta]);
  }
};
module.exports = seguridadModel;