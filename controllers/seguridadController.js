const usuariosModel = require("../models/usuariosModel");
const seguridadModel = require("../models/seguridadModel");
const seguridadController = {
  loginAutenticacion: async (req, res) => {
    try {
      const { numero_tarjeta, clave, dni, captcha } = req.body;
      if (captcha !== "X7R9") return res.status(400).json({ error: "Captcha inválido." });
      const usuario = await usuariosModel.validarCredenciales(numero_tarjeta, clave, dni);
      if (!usuario) return res.status(401).json({ error: "Credenciales incorrectas." });
      await usuariosModel.registrarAuditoria(dni, "LOGIN_EXITOSO");
      res.status(200).json({ estado: "ACCESO_CONCEDIDO", tokenSesion: "BCP-JWT-" + Math.random().toString(36).substring(2) });
    } catch (error) { res.status(500).json({ error: error.message }); }
  },
  configurarPermisosTarjeta: async (req, res) => {
    try {
      const { comprasInternet, comprasExtranjero, idTarjeta } = req.body;
      await seguridadModel.actualizarConfigTarjeta(idTarjeta, comprasInternet, comprasExtranjero);
      res.status(200).json({ exito: true });
    } catch (error) { res.status(500).json({ error: error.message }); }
  },
  cambiarPinDebito: async (req, res) => {
    try {
      const { nuevoPin, idTarjeta } = req.body;
      if (!nuevoPin || nuevoPin.length !== 4) return res.status(400).json({ mensaje: "PIN incorrecto" });
      await seguridadModel.actualizarPin(idTarjeta, nuevoPin);
      res.status(200).json({ exito: true });
    } catch (error) { res.status(500).json({ error: error.message }); }
  },
  generarCvvDinamico: async (req, res) => {
    res.status(200).json({ cvvDinamico: Math.floor(100 + Math.random() * 900).toString(), expiracionSegundos: 60 });
  }
};
module.exports = seguridadController;