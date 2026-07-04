const pool = require("../config/db");
const authModel = {
  buscarUsuario: async (tarjeta) => {
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE numero_tarjeta = ?", [tarjeta]);
    return rows[0] || null;
  },
  actualizarOTP: async (dni, otp) => {
    await pool.query("UPDATE usuarios SET otp_actual = ? WHERE dni = ?", [otp, dni]);
  },
  vincularDispositivo: async (dni, dispositivo) => {
    await pool.query("UPDATE usuarios SET dispositivo_vinculado = ? WHERE dni = ?", [dispositivo, dni]);
  },
  limpiarOTP: async (dni) => {
    await pool.query("UPDATE usuarios SET otp_actual = NULL WHERE dni = ?", [dni]);
  }
};
module.exports = authModel;