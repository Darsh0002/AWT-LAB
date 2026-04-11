const express = require("express");

const Student = require("../models/Student");
const Institute = require("../models/Institute");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * GET ALUMNI of logged-in user's institute
 */
router.get("/alumni", protect, async (req, res) => {
  try {
    let instituteId;

    // 🏫 If admin
    if (req.user.role === "admin") {
      const institute = await Institute.findOne({
        adminUser: req.user.id
      });

      if (!institute) {
        return res.status(404).json({ message: "Institute not found" });
      }

      instituteId = institute._id;

    } else {
      // 👨‍🎓 student / alumni
      const student = await Student.findOne({
        userId: req.user.id
      });

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      instituteId = student.instituteId;
    }

    // 🧠 Current year
    const currentYear = new Date().getFullYear();

    // 📚 Fetch alumni (passoutYear <= currentYear)
    const alumni = await Student.find({
      instituteId,
      passoutYear: { $lte: currentYear }
    }).select("-password");

    res.json({
      total: alumni.length,
      alumni
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch alumni"
    });
  }
});

module.exports = router;