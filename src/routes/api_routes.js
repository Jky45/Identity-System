const express = require("express");
const registerService = require("../services/registerService.js");
const attestService = require("../services/attestService.js");
const getIdentityService = require("../services/getIdentityService.js");
const authenticateService = require("../services/authenticateService.js");

const router = express.Router();

router.post("/register", registerService);
router.post("/attest", attestService);
router.get("/get-identity/:did", getIdentityService);
router.post("/authenticate", authenticateService);

module.exports = router;
