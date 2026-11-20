
const express = require("express");
const router = express.Router();

const Feedback = require("../models/Feedback");

// ==================================
// POST API - Save feedback to MongoDB
// ==================================

router.post("/", async (req, res) => {
  try {
    const {
      customerName,
      feedback,
      category,
      sentiment,
      priority
    } = req.body;

    const newFeedback = new Feedback({
      customerName,
      feedback,
      category,
      sentiment,
      priority
    });

    const savedFeedback = await newFeedback.save();

    res.status(201).json({
      message: "Feedback saved successfully!",
      data: savedFeedback
    });

  } catch (error) {
    res.status(400).json({
      message: "Failed to save feedback",
      error: error.message
    });
  }
});


// ==================================
// GET API - Retrieve feedback
// ==================================

router.get("/", async (req, res) => {
  try {
    const feedbackList = await Feedback.find().sort({
      createdAt: -1
    });

    res.status(200).json({
      message: "Feedback retrieved successfully!",
      data: feedbackList
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve feedback",
      error: error.message
    });
  }
});


// ==================================
// PUT API - Update existing feedback
// ==================================

router.put("/:id", async (req, res) => {
  try {
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedFeedback) {
      return res.status(404).json({
        message: "Feedback not found"
      });
    }

    res.status(200).json({
      message: "Feedback updated successfully!",
      data: updatedFeedback
    });

  } catch (error) {
    res.status(400).json({
      message: "Failed to update feedback",
      error: error.message
    });
  }
});


// Export router

module.exports = router;
