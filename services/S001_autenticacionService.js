const pool = require("../config/db");
const usuariosModel = require("../models/usuariosModel");

const S001_autenticacionService = {
  iniciarSesion: async (username, password, captchaIngresado, captchaCorrecto) => {
    if (captchaIngresado !== captchaCorrecto) throw new Error("Código Captcha inválido.");
    
    const usuarios = await usuariosModel.getAllUsuarios();
    const usuarioValido = usuarios.find(u => u.username === username); 
    if (!usuarioValido) throw new Error("Credenciales incorrectas.");
    
    // Regla de Negocio: Registrar acceso en auditoría de la Base de Datos
    await pool.query("INSERT INTO auditoria_accesos (username, accion) VALUES (?, 'INICIO_SESION_EXITOSO')", [username]);
    
    return { estado: "ACCESO_CONCEDIDO", tokenSesion: "BCP-JWT-" + Math.random().toString(36).substring(2) };
  }
};
module.exports = S001_autenticacionService;