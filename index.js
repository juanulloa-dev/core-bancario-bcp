const express = require("express");
const pool = require("./config/db");
const usuariosRoutes = require("./routes/usuariosRoutes");
const app = express();

app.get("/", (req, res) => {
  res.send("Hola mundo");
});

app.use("/usuarios", usuariosRoutes);

app.listen(3000, () => {
  console.log("Servidor en ruta: http://localhost:3000");
});
