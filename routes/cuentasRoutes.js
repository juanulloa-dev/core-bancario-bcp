const r = require("express").Router(); 
const c = require("../controllers/cuentasController");

r.get("/saldos", c.verCuentasYSaldos); 
r.get("/detalles", c.verDetalleYCCI); 
r.get("/tarjetas", c.verTarjetasCreditoDebito); 
r.get("/historial", c.verMovimientosEstadoCuenta); 

module.exports = r;