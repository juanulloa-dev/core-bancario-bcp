const r = require("express").Router(); 
const c = require("../controllers/yapeController");

r.post("/vincular", c.vincularYapeBCP); 
r.post("/enviar", c.enviarDineroYape); 
r.post("/qr/generar", c.generarCobroQR); 
r.post("/qr/pagar", c.escanearYPagosQR); 
r.post("/desvincular", c.desvincularYape); 

module.exports = r; 