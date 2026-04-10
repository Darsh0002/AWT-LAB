const express = require("express");
const Job = require("../models/Job");
const Institute = require("../models/Institute");
const Student = require("../models/Student");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * CREATE JOB
 * Allowed: admin + alumni
 */
router.post("/", protect, async (req, res) => {
  try {
    // Allow only admin or alumni
    if (req.user.role !== "admin" && req.user.role !== "student") {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    let institute;

    // If admin → find institute
    if (req.user.role === "admin") {
      institute = await Institute.findOne({
        adminUser: req.user.id
      });
    } else {
      // If student/alumni → find via Student collection
      const student = await Student.findOne({
        userId: req.user.id
      });

      if (!student) {
        return res.status(404).json({
          message: "Student not found"
        });
      }

      // OPTIONAL: Only alumni can post jobs
      const currentYear = new Date().getFullYear();
      if (student.passoutYear > currentYear) {
        return res.status(403).json({
          message: "Only alumni can post jobs"
        });
      }

      institute = { _id: student.instituteId };
    }

    if (!institute) {
      return res.status(404).json({
        message: "Institute not found"
      });
    }

    // Get job data from request
    const {
      title,
      company,
      description,
      location,
      salary,
      applyLink
    } = req.body;

    // Basic validation
    if (!title) {
      return res.status(400).json({
        message: "Job title is required"
      });
    }

    // Create job
    const job = await Job.create({
      title,
      company,
      description,
      location,
      salary,
      applyLink,
      postedBy: req.user.id,
      instituteId: institute._id
    });

    res.status(201).json({
      message: "Job created successfully",
      job
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create job"
    });
  }
});

module.exports = router;