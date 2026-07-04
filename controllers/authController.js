const authModel = require("../models/authModel");
const authController = {
  login: async (req, res) => {
    try {
      const { numero_tarjeta, clave_internet } = req.body;
      const user = await authModel.buscarUsuario(numero_tarjeta);
      if (!user || user.clave_internet !== clave_internet) return res.status(401).json({ msg: "Credenciales inválidas" });
      res.status(200).json({ msg: "Paso 1 exitoso", dni: user.dni, tokenDigitalSeed: user.token_digital_seed });
    } catch (e) { res.status(500).json({ error: e.message }); }
  },
  verificarOTP: async (req, res) => {
    try {
      const { dni, otp } = req.body;
      // Simulación de verificación OTP guardado
      res.status(200).json({ msg: "OTP verificado", tokenSesion: "SESSION-BCP-" + Math.random().toString(36).substring(2) });
    } catch (e) { res.status(500).json({ error: e.message }); }
  },
  reconocerDispositivo: async (req, res) => {
    try {
      const { dni, dispositivo } = req.body;
      await authModel.vincularDispositivo(dni, dispositivo);
      res.status(200).json({ msg: "Dispositivo registrado con éxito" });
    } catch (e) { res.status(500).json({ error: e.message }); }
  },
  recuperarAcceso: async (req, res) => {
    const otpNuevo = Math.floor(100000 + Math.random() * 900000).toString();
    res.status(200).json({ msg: "Código de recuperación enviado al SMS/Correo registrado", codigoSimulado: otpNuevo });
  },
  logout: async (req, res) => {
    res.status(200).json({ msg: "Sesión destruida y Token Digital revocado en el dispositivo" });
  }
};
module.exports = authController;