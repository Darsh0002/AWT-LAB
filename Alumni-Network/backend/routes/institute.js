const express = require("express");

const Institute = require("../models/Institute");
const Student = require("../models/Student");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * GET institute info for logged-in user
 */
router.get("/me", protect, async (req, res) => {
  try {
    let institute;

    // 🏫 Admin
    if (req.user.role === "admin") {
      institute = await Institute.findOne({
        adminUser: req.user.id
      });

    } else {
      // 👨‍🎓 Student / Alumni
      const student = await Student.findOne({
        userId: req.user.id
      });

      if (!student) {
        return res.status(404).json({
          message: "Student not found"
        });
      }

      institute = await Institute.findById(student.instituteId);
    }

    if (!institute) {
      return res.status(404).json({
        message: "Institute not found"
      });
    }

    res.json({
      id: institute._id,
      name: institute.instituteName,
      email: institute.email,
      website: institute.website
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch institute"
    });
  }
});

module.exports = router;