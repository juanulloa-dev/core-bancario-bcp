const express = require("express");
const app = express();
app.use(express.json());

const usuariosRoutes = require("./routes/usuariosRoutes");
const saldosRoutes = require("./routes/saldosRoutes");
const seguridadRoutes = require("./routes/seguridadRoutes");
const transaccionesRoutes = require("./routes/transaccionesRoutes");
const yapeRoutes = require("./routes/yapeRoutes");
const pagosRoutes = require("./routes/pagosRoutes");
const prestamosRoutes = require("./routes/prestamosRoutes");

app.use("/usuarios", usuariosRoutes);
app.use("/api/bcp/gestion", saldosRoutes);
app.use("/api/bcp/seguridad", seguridadRoutes);
app.use("/api/bcp/transacciones", transaccionesRoutes);
app.use("/api/bcp/canales", yapeRoutes);
app.use("/api/bcp/pagos", pagosRoutes);
app.use("/api/bcp/prestamos", prestamosRoutes);

app.listen(3000, () => console.log("====================================\n  CORE BCP EQUILIBRADO EN PUERTO 3000\n===================================="));