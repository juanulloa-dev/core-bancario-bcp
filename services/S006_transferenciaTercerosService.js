// S006: Ejecutar Transferencia Terceros
const bcpModel = require("../models/bcpModel");
const S006_transferenciaTercerosService = {
  ejecutarEnvioTerceros: async (cuentaOrigen, cuentaDestino, monto) => {
    await bcpModel.descontarSaldo(cuentaOrigen, monto);
    return { estado: "PROCESADO_ACID", camaraCompensacion: "CCE_ONLINE", codigoVoucher: "TX3-" + Math.floor(100000 + Math.random() * 900000) };
  }
};
module.exports = S006_transferenciaTercerosService;