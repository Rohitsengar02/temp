const express = require("express");
const Story = require("../models/Story");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get all stories for the authenticated user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const stories = await Story.find({ userId: req.user.userId });
    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new story
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, text, images } = req.body;
    const story = new Story({ title, text, images, userId: req.user.userId });
    await story.save();
    res.status(201).json(story);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
