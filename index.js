const cors = require("cors");
const express = require("express");
const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/bcp/auth", require("./routes/authRoutes"));
app.use("/api/bcp/cuentas", require("./routes/cuentasRoutes"));
app.use("/api/bcp/transferencias", require("./routes/transferenciasRoutes"));
app.use("/api/bcp/yape", require("./routes/yapeRoutes"));
app.use("/api/bcp/pagos", require("./routes/pagosRoutes"));
app.use("/api/bcp/divisas", require("./routes/divisasRoutes"));
app.use("/api/bcp/prestamos", require("./routes/prestamosRoutes"));
app.use("/api/bcp/inversiones", require("./routes/inversionesRoutes"));

app.listen(3000, () => {
  console.log("====================================================");
  console.log("CORE SYSTEM BCP");
  console.log("====================================================");
}); 