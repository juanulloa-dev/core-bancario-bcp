const r = require("express").Router(); 
const c = require("../controllers/pagosController");

r.post("/servicios", c.pagoServiciosPublicos); 
r.post("/recargas", c.recargasCelularOperadoras); 
r.post("/tarjeta/bcp", c.pagoTarjetaCreditoBCP); 
r.post("/tarjeta/otros", c.pagoTarjetaOtrosBancos); 
r.get("/consultar", c.consultarDeudaServicio);

module.exports = r;