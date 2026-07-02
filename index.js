const express = require("express");
const pool = require("./config/db");

// 1. IMPORTACIÓN: Rutas iniciales del grupo
const usuariosRoutes = require("./routes/usuariosRoutes");

// 2. IMPORTACIÓN: Tu arquitectura modular del BCP
const cuentasRoutes = require("./routes/cuentasRoutes");
const transaccionesRoutes = require("./routes/transaccionesRoutes");
const tramitesRoutes = require("./routes/tramitesRoutes");

const app = express();

// Middleware esencial para procesar los JSON de Postman
app.use(express.json());

// 🚦 Montaje de Endpoints del grupo original
app.use("/usuarios", usuariosRoutes);

// 🚦 Montaje de tus Endpoints Empresariales BCP
app.use("/api/bcp/gestion", cuentasRoutes);
app.use("/api/bcp/transacciones", transaccionesRoutes);
app.use("/api/bcp/tramites", tramitesRoutes);

app.get("/", (req, res) => {
  res.send("Core Bancario Corporativo Multi-Dominio BCP Activo");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("====================================================");
  console.log(`   CORE CORPORATIVO BCP OPERANDO EN PUERTO ${PORT}   `);
  console.log("====================================================");
});