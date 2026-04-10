const express = require("express");

const Post = require("../models/Post");
const Institute = require("../models/Institute");
const Student = require("../models/Student");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * CREATE POST
 * Allowed: admin + student + alumni
 */
router.post("/", protect, async (req, res) => {
  try {
    let institute;

    // If admin → find institute
    if (req.user.role === "admin") {
      institute = await Institute.findOne({
        adminUser: req.user.id
      });
    } else {
      // Student / Alumni
      const student = await Student.findOne({
        userId: req.user.id
      });

      if (!student) {
        return res.status(404).json({
          message: "Student not found"
        });
      }

      institute = { _id: student.instituteId };
    }

    if (!institute) {
      return res.status(404).json({
        message: "Institute not found"
      });
    }

    // Get post data
    const { content, image } = req.body;

    // Validation
    if (!content) {
      return res.status(400).json({
        message: "Post content is required"
      });
    }

    // Create post
    const post = await Post.create({
      content,
      image,
      postedBy: req.user.id,
      instituteId: institute._id
    });

    res.status(201).json({
      message: "Post created successfully",
      post
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create post"
    });
  }
});

module.exports = router;