const r = require("express").Router(); 
const c = require("../controllers/inversionesController");

r.post("/plazofijo", c.aperturarDepositoPlazoFijo); 
r.post("/fondos", c.suscribirFondosMutuos); 
r.post("/seguros", c.contratarSegurosYRenovacion); 
r.get("/portafolio", c.consultarPortafolioYRentabilidad); 

module.exports = r;