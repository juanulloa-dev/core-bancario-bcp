const pool = require("../config/db");

const S009_simulacionCreditoService = {
  simularCuotasPrestamo: async (montoSolicitado, nroCuotas) => {
    if (montoSolicitado <= 0) throw new Error("El monto solicitado debe ser mayor a cero.");
    
    const tcea = 45.50;
    const cuotaMensual = Math.round(((montoSolicitado * 1.45) / nroCuotas) * 100) / 100;
    const idSolicitud = "SOL-" + Math.floor(100000 + Math.random() * 900000);
    
    // Inserta dinámicamente la simulación para que quede registrada en MySQL
    await pool.query(
      "INSERT INTO simulaciones_credito (id_solicitud, monto_solicitado, cuotas_pactadas, tcea_aplicada, monto_cuota, estado_solicitud) VALUES (?, ?, ?, ?, ?, 'SIMULADO_ONLINE')",
      [idSolicitud, montoSolicitado, nroCuotas, tcea, cuotaMensual]
    );
    
    return { idSolicitud, moneda: "PEN", montoCuotaEstimada: cuotaMensual, tceaAplicada: `${tcea}%`, declaracionJurada: "ACEPTADA" };
  }
};
module.exports = S009_simulacionCreditoService;