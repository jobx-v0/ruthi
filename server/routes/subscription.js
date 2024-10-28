const express = require("express");
const SubscriptionController = require("../controllers/subscription");
const router = express.Router();

router.post("/subscribe", SubscriptionController.emailSubscription);

module.exports = router;
