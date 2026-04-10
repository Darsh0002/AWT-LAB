const express = require("express");

const Event = require("../models/Event");
const Institute = require("../models/Institute");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * CREATE EVENT
 * Allowed: admin only
 */
router.post("/", protect, async (req, res) => {
  try {
    // Only admin allowed
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admin only."
      });
    }

    // Find institute
    const institute = await Institute.findOne({
      adminUser: req.user.id
    });

    if (!institute) {
      return res.status(404).json({
        message: "Institute not found"
      });
    }

    // Get event data
    const {
      title,
      description,
      date,
      location,
      organizer
    } = req.body;

    // Validation
    if (!title || !date) {
      return res.status(400).json({
        message: "Title and date are required"
      });
    }

    // Create event
    const event = await Event.create({
      title,
      description,
      date,
      location,
      organizer,
      instituteId: institute._id
    });

    res.status(201).json({
      message: "Event created successfully",
      event
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create event"
    });
  }
});

module.exports = router;