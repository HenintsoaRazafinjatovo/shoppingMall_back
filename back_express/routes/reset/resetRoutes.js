const express = require("express");
const router = express.Router();
const { resetDatabase } = require("../../controllers/reset/resetController");

router.post("/test", resetDatabase);

module.exports = router;
