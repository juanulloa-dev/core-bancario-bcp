const S001 = require("../services/S001_autenticacionService");
const S008 = require("../services/S008_conveniosService");
const S009 = require("../services/S009_simulacionCreditoService");
const S010 = require("../services/S010_desembolsoPrestamoService");
const bcpModel = require("../models/bcpModel");

const tramitesController = {
  loginAutenticacion: async (req, res) => {
    try {
      // S001: Autenticación y Seguridad
      const { username, password, captcha } = req.body;
      const data = await S001.iniciarSesion(username, password, captcha, "X7R9"); // "X7R9" es el captcha simulado correcto
      res.status(200).json(data);
    } catch (error) { res.status(500).json({ error: error.message }); }
  },
  pagarServicios: async (req, res) => {
    try {
      // S008: Consulta y Carga de Convenios
      const { idServicio, cuentaId } = req.body;
      const data = await S008.pagarReciboConvenio(idServicio, cuentaId);
      res.status(200).json({ exito: true, ...data, mensaje: "Recibo pagado vía Convenios BCP." });
    } catch (error) { res.status(500).json({ error: error.message }); }
  },
  simularCreditoCampaña: async (req, res) => {
    try {
      // S009: Simulación y Configuración de Crédito
      const { montoSolicitado, cuotas } = req.body;
      const data = await S009.simularCuotasPrestamo(montoSolicitado, cuotas);
      res.status(200).json(data);
    } catch (error) { res.status(500).json({ error: error.message }); }
  },
  desembolsarPréstamoOnline: async (req, res) => {
    try {
      // S010: Orquestación y Desembolso de Préstamo
      const data = await S010.ejecutarAbonoPrestamo(req.body.montoAbonar);
      res.status(200).json(data);
    } catch (error) { res.status(500).json({ error: error.message }); }
  },
  cuotificarCompras: async (req, res) => {
    try {
      const { idCompra, nroCuotas } = req.body;
      await bcpModel.actualizarEstadoCompra(idCompra, `FRACCIONADO_${nroCuotas}_MESES`);
      res.status(200).json({ exito: true, compraId: idCompra, cuotasPactadas: nroCuotas });
    } catch (error) { res.status(500).json({ error: error.message }); }
  },
  ejecutarTipoCambioPreferencial: async (req, res) => {
    const { montoDolares, tipoOperacion } = req.body;
    const tasa = tipoOperacion === "COMPRA" ? 3.715 : 3.745;
    res.status(200).json({ operacion: "Tipo de Cambio Preferencial", tasaAplicada: tasa, totalSoles: Math.round((montoDolares * tasa) * 100) / 100 });
  },
  solicitarProductoOnline: async (req, res) => {
    res.status(200).json({ estadoSolicitud: "APROBADO_100%_ONLINE", producto: req.body.tipoProducto });
  },
  validarTokenDigitalInvisble: async (req, res) => {
    res.status(200).json({ modulo: "Token Digital Integrado", estado: "ACTIVO_INVISIBLE" });
  }
};
module.exports = tramitesController;