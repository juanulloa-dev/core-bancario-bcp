// S004: Preparación y Ejecución de Transferencia Propia
const bcpModel = require("../models/bcpModel");
const S004_transferenciaPropiaService = {
  transferirMismoTitular: async (cuentaOrigen, cuentaDestino, monto) => {
    if (cuentaOrigen === cuentaDestino) throw new Error("La cuenta de destino no puede ser la misma de origen.");
    await bcpModel.descontarSaldo(cuentaOrigen, monto);
    // Simula el abono atómico a la cuenta destino propia
    return { estado: "EXITOSO", operacion: "TRANSFERENCIA_PROPIA", voucher: "TRP-" + Math.floor(100000 + Math.random() * 900000) };
  }
};
module.exports = S004_transferenciaPropiaService;