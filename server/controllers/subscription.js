const Subscription = require("../models/Subscription");

const emailSubscription = async (req, res) => {
  const { email } = req.body;

  try {
    // Create a new subscription record
    const newSubscription = new Subscription({ email });
    await newSubscription.save();

    res.status(201).json({ message: "Subscription successful!" });
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate email entry
      res.status(400).json({ message: "Email already subscribed." });
    } else {
      res.status(500).json({ message: "Subscription failed.", error });
    }
  }
};

const SubscriptionController = { emailSubscription };

module.exports = SubscriptionController;
