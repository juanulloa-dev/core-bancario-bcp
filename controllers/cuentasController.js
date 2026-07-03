const S002 = require("../services/S002_cargaPerfilService");
const S003 = require("../services/S003_consultaEstadoService");
const bcpModel = require("../models/bcpModel");

const cuentasController = {
  consultaAhorrosSueldo: async (req, res) => {
    try {
      // S002: Carga de Perfil y Productos Financieros
      const cuentas = await S002.cargarCuentasActivas("TOKEN-SIMULADO-JWT");
      res.status(200).json({ cliente: "JUAN ALEXIS ULLOA TORRES", cuentas });
    } catch (error) { res.status(500).json({ error: error.message }); }
  },
  obtenerHistorialMovimientos: async (req, res) => {
    try {
      // S003: Consulta de Estado de Cuenta
      const data = await S003.obtenerMovimientos("CTA-101");
      res.status(200).json(data);
    } catch (error) { res.status(500).json({ error: error.message }); }
  },
  configurarPermisosTarjeta: async (req, res) => {
    try {
      const { comprasInternet, comprasExtranjero, idTarjeta } = req.body;
      await bcpModel.actualizarConfigTarjeta(idTarjeta, comprasInternet, comprasExtranjero);
      res.status(200).json({ exito: true, switchInternet: comprasInternet ? "ENCENDIDO" : "APAGADO" });
    } catch (error) { res.status(500).json({ error: error.message }); }
  },
  cambiarPinDebito: async (req, res) => {
    try {
      const { nuevoPin, idTarjeta } = req.body;
      if (!nuevoPin || nuevoPin.length !== 4) return res.status(400).json({ mensaje: "PIN inválido." });
      await bcpModel.actualizarPin(idTarjeta, nuevoPin);
      res.status(200).json({ exito: true, mensaje: "Clave PIN modificada con éxito." });
    } catch (error) { res.status(500).json({ error: error.message }); }
  },
  generarCvvDinamico: async (req, res) => {
    res.status(200).json({ tarjetaId: req.params.id, cvvDinamico: Math.floor(100 + Math.random() * 900).toString(), expiracionSegundos: 60 });
  },
  gestionarWawaditos: async (req, res) => {
    try {
      const { monto, operacion, cuentaId } = req.body;
      await bcpModel.operarWawaditos(cuentaId, monto, operacion);
      res.status(200).json({ exito: true, mensaje: `Operación Wawaditos (${operacion}) completada.` });
    } catch (error) { res.status(500).json({ error: error.message }); }
  }
};
module.exports = cuentasController;