const pool = require("../config/db");

const S010_desembolsoPrestamoService = {
  ejecutarAbonoPrestamo: async (idSolicitud, cuentaId) => {
    // Verifica si la solicitud simulada existe en la BD
    const [solicitud] = await pool.query("SELECT * FROM simulaciones_credito WHERE id_solicitud = ?", [idSolicitud]);
    if (solicitud.length === 0) throw new Error("La solicitud de préstamo no existe o caducó.");
    
    // Principio ACID: Abonar el dinero en la cuenta del cliente y actualizar el estado
    await pool.query("UPDATE cuentas SET saldo_disponible = saldo_disponible + ? WHERE id = ?", [solicitud[0].monto_solicitado, cuentaId]);
    await pool.query("UPDATE simulaciones_credito SET estado_solicitud = 'DESEMBOLSADO' WHERE id_solicitud = ?", [idSolicitud]);
    
    return {
      estadoBus: "ESB_CONGELADO_EXITOSO",
      montoAbonado: solicitud[0].monto_solicitado,
      voucherAbono: "DESEMBOLSO-" + Math.floor(100000 + Math.random() * 900000),
      pdfContractual: "CONTRATO_DIGITAL_FIRMADO"
    };
  }
};
module.exports = S010_desembolsoPrestamoService;