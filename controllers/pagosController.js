const pagosModel = require("../models/pagosModel");
const txModel = require("../models/transferenciasModel");
const divisasModel = require("../models/divisasModel");
const pool = require("../config/db");

const pagosController = {
  pagoServiciosPublicos: async (req, res) => {
    try {
      const { idEmpresa, cuentaId } = req.body;
      const empresa = await pagosModel.consultarEmpresa(idEmpresa);
      if (!empresa || empresa.monto_deuda <= 0) return res.status(400).json({ msg: "No registra deudas pendientes" });

      // Consultamos la moneda de la cuenta elegida
      const [cuentaData] = await pool.query("SELECT tipo_cuenta FROM cuentas WHERE id = ?", [cuentaId]);
      const esDolares = cuentaData[0].tipo_cuenta.includes('DOL');

      let montoADescontar = parseFloat(empresa.monto_deuda);
      let detalleComprobante = `Pago de recibo ${empresa.nombre_empresa}`;

      if (esDolares) {
        // La deuda está en Soles, pagas con Dólares -> El banco te vende los Soles (montoSoles / tasaVenta)
        const tasas = divisasModel.obtenerTipoCambioActual();
        montoADescontar = parseFloat((empresa.monto_deuda / tasas.venta).toFixed(2));
        detalleComprobante = `Pago ${empresa.nombre_empresa}: S/. ${empresa.monto_deuda} cancelado con $ ${montoADescontar} (T.C. ${tasas.venta})`;
      }

      await txModel.verificarYDescontar(cuentaId, montoADescontar);
      await pagosModel.liquidarDeudaEmpresa(idEmpresa);
      const v = await txModel.registrarComprobante(cuentaId, idEmpresa, "PAGO_SERVICIO", montoADescontar, detalleComprobante);

      res.status(200).json({ status: "RECIBO_PAGADO", empresa: empresa.nombre_empresa, total: montoADescontar, comprobante: v, msg: detalleComprobante });
    } catch (e) { res.status(400).json({ error: e.message }); }
  },
  recargasCelularOperadoras: async (req, res) => {
    try {
      const { cuentaId, operadoraId, numeroCelular, monto } = req.body;
      await txModel.verificarYDescontar(cuentaId, monto);
      const v = await txModel.registrarComprobante(cuentaId, operadoraId, "RECARGA", monto, `Recarga de saldo al numero ${numeroCelular}`);
      res.status(200).json({ status: "RECARGA_EXITOSA", numero: numeroCelular, montoRecargado: monto, comprobante: v });
    } catch (e) { res.status(400).json({ error: e.message }); }
  },
  pagoTarjetaCreditoBCP: async (req, res) => {
    try {
      const { cuentaId, idTarjeta, montoAPagar } = req.body; // Pago Minimo, Total o Parcial
      await txModel.verificarYDescontar(cuentaId, montoAPagar);
      await pagosModel.descontarDeudaTarjeta(idTarjeta, montoAPagar);
      const v = await txModel.registrarComprobante(cuentaId, idTarjeta, "PAGO_TARJETA", montoAPagar, "Abono directo a deuda de Tarjeta de Credito BCP");
      res.status(200).json({ status: "TARJETA_PAGADA_EXITO", comprobante: v });
    } catch (e) { res.status(400).json({ error: e.message }); }
  },
  pagoTarjetaOtrosBancos: async (req, res) => {
    try {
      const { cuentaId, numeroTarjetaDestino, bancoDestino, monto } = req.body;
      await txModel.verificarYDescontar(cuentaId, monto);
      const v = await txModel.registrarComprobante(cuentaId, numeroTarjetaDestino, "PAGO_TARJETA_OTROS", monto, `Pago de tarjeta interbancaria hacia ${bancoDestino}`);
      res.status(200).json({ status: "TRANSMISION_CCE_OK", mensaje: "El abono se reflejará en el banco destino en el lapso del horario seleccionado", comprobante: v });
    } catch (e) { res.status(400).json({ error: e.message }); }
  },
  // Agrega esto dentro de pagosController para poder buscar los datos del recibo
  consultarDeudaServicio: async (req, res) => {
    try {
      const { nombreEmpresa } = req.query;
      // CORRECCIÓN: Agregamos codigo_recaudacion al SELECT
      const [rows] = await pool.query(
        "SELECT id_empresa, nombre_empresa, codigo_recaudacion, monto_deuda FROM empresas_afiliadas WHERE nombre_empresa LIKE ?", 
        [`%${nombreEmpresa}%`]
      );
      if (rows.length === 0) return res.status(404).json({ error: "No se encontraron empresas con ese nombre." });
      
      res.status(200).json(rows); 
    } catch (e) { res.status(500).json({ error: e.message }); }
  },
};
module.exports = pagosController;