const express = require("express");
const XLSX = require("xlsx");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const upload = require("../middleware/upload");
const Student = require("../models/Student");
const Institute = require("../models/Institute");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();


router.post("/upload-excel", protect, upload.single("file"), async (req, res) => {
    try {
        // Allow only admin
        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Access denied. Admin only.",
            });
        }

        // Find institute of logged-in admin
        const institute = await Institute.findOne({
            adminUser: req.user.id,
        });

        if (!institute) {
            return res.status(404).json({
                message: "Institute not found for this admin",
            });
        }

        // Read Excel file
        const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);

        const students = [];
        const currentYear = new Date().getFullYear();
        let insertedCount = 0;
        let skippedCount = 0;

        for (const row of rows) {
            if (!row.email || !row.enrollment_no) {
                skippedCount++;
                continue;
            }

            // Check if User already exists
            const existingUser = await User.findOne({ email: row.email });
            if (existingUser) {
                skippedCount++;
                continue;
            }

            // Check if Student already exists
            const existingStudent = await Student.findOne({
                enrollment_no: row.enrollment_no,
                instituteId: institute._id,
            });
            if (existingStudent) {
                skippedCount++;
                continue;
            }

            // Password = enrollment number
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(
                String(row.enrollment_no),
                salt
            );

            const passoutYear = Number(row.passoutYear);
            
            // Create auth user
            const user = await User.create({
                email: row.email,
                password: hashedPassword,
                role: "student",
            });

            // Create student profile
            await Student.create({
                full_name: row.full_name,
                email: row.email,
                phone: row.phone,
                enrollment_no: row.enrollment_no,
                course: row.course,
                branch: row.branch,
                passoutYear,
                company: row.company,
                job: row.job,
                linkedinuri: row.linkedinuri,
                password: hashedPassword,
                instituteId: institute._id,
                userId: user._id,
            });

            insertedCount++;
        }

        // Bulk insert (skip duplicates)
        const result = await Student.insertMany(students, {
            ordered: false,
        });

        res.status(201).json({
            message: "Excel upload completed",
            inserted: insertedCount,
            skipped: skippedCount,
            total: rows.length
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Excel upload failed",
            error: error.message,
        });
    }
}
);

module.exports = router;