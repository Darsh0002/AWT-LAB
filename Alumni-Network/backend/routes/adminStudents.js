const express = require("express");
const Student = require("../models/Student");
const Institute = require("../models/Institute");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// GET all students for logged-in admin's institute
router.get("/students", protect, async (req, res) => {
  try {
    let instituteId;
    
    // Resolve institute based on role
    if (req.user.role === "admin") {
      const institute = await Institute.findOne({
        adminUser: req.user.id,
      });
      if (institute) instituteId = institute._id;
    } else {
      // For student/alumni, find via their student record
      const student = await Student.findOne({
        userId: req.user.id,
      });
      if (student) instituteId = student.instituteId;
    }

    if (!instituteId) {
      return res.status(404).json({
        message: "Institute not found",
      });
    }

    // Fetch students of this institute
    const students = await Student.find({
      instituteId: instituteId,
    }).select("-password"); // never send password

    const formattedStudents = students.map((student) => {
      return {
        id: student._id,
        full_name: student.full_name,
        email: student.email,
        phone: student.phone,
        enrollment_no: student.enrollment_no,
        course: student.course,
        branch: student.branch,
        passoutYear: student.passoutYear,
        company: student.company,
        job: student.job,
        linkedinuri: student.linkedinuri
      };
    });

    res.status(200).json({
      total: formattedStudents.length,
      students: formattedStudents,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch students",
      error: error.message,
    });
  }
});

module.exports = router;