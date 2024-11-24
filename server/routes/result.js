const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const ResultController = require("../controllers/resultController");

router.get("/get-result/:jobId", authMiddleware, ResultController.getResult);

module.exports = router;
