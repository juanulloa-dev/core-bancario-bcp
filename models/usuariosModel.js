const pool = require("../config/db");

const usuariosModel = {
  getAllUsuarios: async () => {
    const connection = await pool.getConnection();
    const [rows] = await connection.query("SELECT * FROM usuarios");
    connection.release();
    return rows;
  },
};

module.exports = usuariosModel;