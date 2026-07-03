const express = require("express");
const router = express.Router();
const yapeController = require("../controllers/yapeController");

router.post("/yape/enviar", yapeController.yapearIntegrable);
router.post("/wardaditos/guardar", yapeController.gestionarWardaditos);
module.exports = router;