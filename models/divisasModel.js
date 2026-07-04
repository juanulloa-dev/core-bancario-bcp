// Mesa cambiaria en memoria por velocidad transaccional
const divisasModel = {
  obtenerTipoCambioActual: () => {
    return { compra: 3.72, venta: 3.76, preferencia: "VIP_SPREAD" };
  }
};
module.exports = divisasModel;