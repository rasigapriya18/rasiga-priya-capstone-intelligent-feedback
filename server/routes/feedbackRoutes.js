
const express = require("express");
const router = express.Router();

const Feedback = require("../models/Feedback");

// POST API - Save feedback to MongoDB
router.post("/", async (req, res) => {
  try {
    const { customerName, feedback, category, sentiment, priority } = req.body;

    const newFeedback = new Feedback({
      customerName,
      feedback,
      category,
      sentiment,
      priority,
    });

    const savedFeedback = await newFeedback.save();

    res.status(201).json({
      message: "Feedback saved successfully!",
      data: savedFeedback,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to save feedback",
      error: error.message,
    });
  }
});

// GET API - Read feedback from MongoDB
router.get("/", async (req, res) => {
  try {
    const feedbackList = await Feedback.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: "Feedback retrieved successfully!",
      data: feedbackList,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve feedback",
      error: error.message,
    });
  }
});

module.exports = router;
