const prestamosModel = require("../models/prestamosModel");
const txModel = require("../models/transferenciasModel");
const pool = require("../config/db");

const prestamosController = {
  simularCreditoCampaña: async (req, res) => {
    try {
      const { montoSolicitado, cuotas, dni } = req.body;
      const mtoNum = parseFloat(montoSolicitado);

      // --- MOTOR DE SCORING CREDITICIO FINANCIERO BASADO EN HISTORIAL ---
      let limiteAprobado = 2000.00; // Línea base garantizada

      if (dni) {
        // 1. Consultar el perfil base del cliente
        const [userRows] = await pool.query("SELECT perfil FROM usuarios WHERE dni = ?", [dni]);
        const perfil = userRows[0]?.perfil || 'REGULAR';

        // 2. Obtener todas las cuentas en Soles asociadas al DNI del cliente
        const [cuentasRows] = await pool.query(
          "SELECT id FROM cuentas WHERE dni_titular = ? AND tipo_cuenta NOT LIKE '%DOL%'", 
          [dni]
        );
        const idsCuentas = cuentasRows.map(c => c.id);

        if (idsCuentas.length > 0) {
          // 3. Sumar todos los abonos/ingresos recibidos en el historial de transacciones
          const [movs] = await pool.query(
            `SELECT SUM(monto) as total_ingresos, COUNT(*) as total_movs 
             FROM historial_transacciones 
             WHERE cuenta_destino IN (?)`, 
            [idsCuentas]
          );

          const totalIngresos = parseFloat(movs[0]?.total_ingresos || 0);
          const cantidadMovs = parseInt(movs[0]?.total_movs || 0);

          // FÓRMULA DE SCORING BCP:
          // Si el usuario tiene actividad transaccional (más de 2 abonos), su línea calculada será:
          // Límite = (Total Ingresos Históricos / Cantidad de Movimientos) * Factor Multiplicador (2.5)
          if (cantidadMovs > 0 && totalIngresos > 0) {
            const ticketPromedioAbono = totalIngresos / cantidadMovs;
            const lineaCalculadaFlujo = Math.round(ticketPromedioAbono * 2.5);

            // Se asigna la línea calculada por flujo si supera los S/. 2,000 base
            if (lineaCalculadaFlujo > limiteAprobado) {
              limiteAprobado = lineaCalculadaFlujo;
            }
          }
        }

        // Si el perfil es VIP explícito, se asegura un techo crediticio corporativo de S/. 50,000
        if (perfil === 'VIP' && limiteAprobado < 50000) {
          limiteAprobado = 50000.00;
        }
      }

      // Validar si el monto solicitado supera la línea calculada por el algoritmo
      if (mtoNum > limiteAprobado) {
        return res.status(400).json({ 
          error: `Monto solicitado excede tu Capacidad de Pago Evaluada. Línea máxima calculada según tus ingresos recientes: S/. ${limiteAprobado.toLocaleString('es-PE', { minimumFractionDigits: 2 })}.` 
        });
      }

      const tcea = 45.50;
      const cuotaMensual = Math.round(((mtoNum * 1.45) / cuotas) * 100) / 100;
      const idSolicitud = "SOL-" + Math.floor(100000 + Math.random() * 900000);

      await prestamosModel.registrarSimulacion(idSolicitud, mtoNum, cuotas, tcea, cuotaMensual);
      
      res.status(200).json({ 
        idSolicitud, 
        montoCuotaEstimada: cuotaMensual, 
        tceaAplicada: `${tcea}%`,
        limiteAprobado
      });
    } catch (e) { res.status(500).json({ error: e.message }); }
  },

  desembolsarPréstamoOnline: async (req, res) => {
    try {
      const { idSolicitud, cuentaId, dniCliente } = req.body;
      const sim = await prestamosModel.obtenerSimulacion(idSolicitud);
      if (!sim || sim.estado_solicitud === "DESEMBOLSADO") throw new Error("Invalido o ya cobrado.");
      await txModel.abonar(cuentaId, sim.monto_solicitado);
      await prestamosModel.actualizarEstadoSimulacion(idSolicitud, "DESEMBOLSADO");
      await prestamosModel.crearPrestamoVigente(idSolicitud, dniCliente, sim.monto_solicitado, sim.cuotas_pactadas, sim.monto_cuota);
      res.status(200).json({ estadoBus: "ESB_CONGELADO_EXITOSO", montoAbonado: parseFloat(sim.monto_solicitado) });
    } catch (e) { res.status(400).json({ error: e.message }); }
  },

  verCronogramaYPrestamos: async (req, res) => {
    try {
      const listado = await prestamosModel.obtenerPrestamosCliente(req.query.dni);
      res.status(200).json(listado);
    } catch (e) { res.status(500).json({ error: e.message }); }
  },

  pagarOAdelantarCuotas: async (req, res) => {
    try {
      const { idPrestamo, cuentaId, numeroCuotas, montoTotalCuotas } = req.body;
      await txModel.verificarYDescontar(cuentaId, montoTotalCuotas);
      await prestamosModel.pagarCuotaModelo(idPrestamo, numeroCuotas);
      const v = await txModel.registrarComprobante(cuentaId, idPrestamo, "PAGO_PRESTAMO", montoTotalCuotas, `Amortización de ${numeroCuotas} cuotas del credito`);
      res.status(200).json({ status: "CUOTA_AMORTIZADA", comprobante: v });
    } catch (e) { res.status(400).json({ error: e.message }); }
  }
};

module.exports = prestamosController;