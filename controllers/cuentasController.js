const bcpModel = require("../models/bcpModel");

const cuentasController = {
  // 1. Consulta de Saldos (Integrante 1)
  consultaAhorrosSueldo: async (req, res) => {
    try {
      const cuentas = await bcpModel.obtenerCuentas();
      res.status(200).json({ cliente: "JUAN ALEXIS ULLOA TORRES", cuentas });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // 4. Configurar Permisos Tarjeta (Integrante 2)
  configurarPermisosTarjeta: async (req, res) => {
    try {
      const { comprasInternet, comprasExtranjero, idTarjeta } = req.body;
      await bcpModel.actualizarConfigTarjeta(idTarjeta, comprasInternet, comprasExtranjero);
      res.status(200).json({ exito: true, idTarjeta, switchInternet: comprasInternet ? "ENCENDIDO" : "APAGADO", switchExtranjero: comprasExtranjero ? "ENCENDIDO" : "APAGADO" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // 5. Cambio de PIN Cajero (Integrante 2)
  cambiarPinDebito: async (req, res) => {
    try {
      const { nuevoPin, idTarjeta } = req.body;
      if (!nuevoPin || nuevoPin.length !== 4) return res.status(400).json({ mensaje: "PIN inválido. Debe tener 4 dígitos." });
      await bcpModel.actualizarPin(idTarjeta, nuevoPin);
      res.status(200).json({ exito: true, mensaje: "Clave PIN modificada con éxito en la base de datos." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // 6. CVV Dinámico Antifraude (Integrante 2)
  generarCvvDinamico: async (req, res) => {
    const cvv = Math.floor(100 + Math.random() * 900);
    res.status(200).json({ tarjetaId: req.params.id, cvvDinamico: cvv.toString(), expiracionSegundos: 60, mensaje: "CVV dinámico generado de forma segura." });
  },

  // 7. Alcancía Virtual Wawaditos (Integrante 3)
  gestionarWawaditos: async (req, res) => {
    try {
      const { monto, operacion, cuentaId } = req.body; // operacion: "AHORRAR" o "RETIRAR"
      await bcpModel.operarWawaditos(cuentaId, monto, operacion);
      res.status(200).json({ exito: true, mensaje: `Dinero enviado a alcancía Wawaditos procesado exitosamente (${operacion}).` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = cuentasController;