// S007: Transferencia Celular Interoperable (Yape)
const bcpModel = require("../models/bcpModel");
const S007_transferenciaCelularService = {
  yapearCelular: async (numeroCelular, cuentaOrigen, monto) => {
    if (!/^[0-9]{9}$/.test(numeroCelular)) throw new Error("El número móvil debe tener un formato válido de 9 dígitos.");
    await bcpModel.descontarSaldo(cuentaOrigen, monto);
    return { estado: "YAPE_ATÓMICO_EXITOSO", redInteroperable: "BCRP_YAPE_PLIN", comision: 0.00 };
  }
};
module.exports = S007_transferenciaCelularService;