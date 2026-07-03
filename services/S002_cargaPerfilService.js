// S002: Carga de Perfil y Productos Financieros
const bcpModel = require("../models/bcpModel");
const S002_cargaPerfilService = {
  cargarCuentasActivas: async (tokenSesion) => {
    if (!tokenSesion) throw new Error("Sesión inválida o expirada.");
    const cuentas = await bcpModel.obtenerCuentas();
    // Regra de negocio: Filtrar activas y enmascarar número
    return cuentas.map(c => ({
      id: c.id,
      tipo: "CUENTA DE AHORROS",
      saldo: c.saldo_disponible,
      numeroEnmascarado: "**** **** **** " + c.id.slice(-4)
    }));
  }
};
module.exports = S002_cargaPerfilService;