const express = require("express");
const { registerIdentity } = require("../services/registerService");
const { createAttestation } = require("../services/attestService");
const { getIdentity } = require("../services/getIdentityService");
const { authenticate } = require("../services/authenticateService");

const router = express.Router();

// Definir las rutas con funciones de callback correctas
router.post("/register", registerIdentity);
router.post("/attest", createAttestation);
router.get("/get-identity", getIdentity);
router.post("/authenticate", authenticate);

module.exports = router;
