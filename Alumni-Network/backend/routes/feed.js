const express = require("express");

const Job = require("../models/Job");
const Post = require("../models/Post");
const Event = require("../models/Event");
const Institute = require("../models/Institute");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * GET FEED (jobs + posts + events)
 * For logged-in user (student/alumni/admin)
 */
router.get("/feed", protect, async (req, res) => {
  try {

    // Find institute of user
    let institute;

    if (req.user.role === "admin") {
      institute = await Institute.findOne({
        adminUser: req.user.id
      });
    } else {
      // student → find via student collection
      const student = await require("../models/Student").findOne({
        userId: req.user.id
      });

      institute = { _id: student.instituteId };
    }

    if (!institute) {
      return res.status(404).json({ message: "Institute not found" });
    }

    // Fetch all data
    const jobs = await Job.find({ instituteId: institute._id })
      .sort({ createdAt: -1 });

    const posts = await Post.find({ instituteId: institute._id })
      .sort({ createdAt: -1 });

    const events = await Event.find({ instituteId: institute._id })
      .sort({ createdAt: -1 });

    res.json({
      jobs,
      posts,
      events
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch feed"
    });
  }
});

module.exports = router;