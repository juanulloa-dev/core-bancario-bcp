const pool = require("./config/db");

async function testConexionDB() {
  console.log("Iniciando test de conexión a la base de datos...");

  try {
    const connection = await pool.getConnection();

    console.log("✔ Conexión exitosa");

    connection.release();
    console.log("✔ Conexión liberada correctamente");

  } catch (error) {
    console.error("✖ Error en conexión:", error.message);
  }
}

testConexionDB();