// S008: Consulta y Carga de Convenios
const bcpModel = require("../models/bcpModel");
const S008_conveniosService = {
  pagarReciboConvenio: async (idServicio, cuentaId) => {
    const servicio = await bcpModel.obtenerDeudaServicio(idServicio);
    await bcpModel.descontarSaldo(cuentaId, servicio.monto_deuda);
    return { empresa: servicio.empresa.toUpperCase(), suministro: servicio.codigo_suministro, totalPagado: servicio.monto_deuda };
  }
};
module.exports = S008_conveniosService;