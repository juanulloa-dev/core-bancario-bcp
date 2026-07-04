const r = require("express").Router(); 
const c = require("../controllers/prestamosController");

r.post("/simular", c.simularCreditoCampaña); 
r.post("/desembolsar", c.desembolsarPréstamoOnline); 
r.get("/cronograma", c.verCronogramaYPrestamos); 
r.post("/cuota/pagar", c.pagarOAdelantarCuotas); 

module.exports = r;