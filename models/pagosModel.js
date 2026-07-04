const pool = require("../config/db");
const pagosModel = {
  consultarEmpresa: async (id) => {
    const [rows] = await pool.query("SELECT * FROM empresas_afiliadas WHERE id_empresa = ?", [id]);
    return rows[0] || null;
  },
  liquidarDeudaEmpresa: async (id) => {
    await pool.query("UPDATE empresas_afiliadas SET monto_deuda = 0.00 WHERE id_empresa = ?", [id]);
  },
  descontarDeudaTarjeta: async (idTarjeta, monto) => {
    await pool.query("UPDATE tarjetas SET linea_credito_disponible = linea_credito_disponible + ?, deuda_fecha_total = deuda_fecha_total - ? WHERE id_tarjeta = ?", [monto, monto, idTarjeta]);
  }
};
module.exports = pagosModel;