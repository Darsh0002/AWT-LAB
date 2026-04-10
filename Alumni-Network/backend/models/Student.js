const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        full_name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        phone: String,

        enrollment_no: {
            type: String,
        },

        course: String,

        branch: String,

        passoutYear: Number,

        company: String,

        job: String,

        linkedinuri: String,

        password: {
            type: String,
            required: true,
        },

        instituteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Institute",
            required: true,
        },

        // Link to auth user
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

studentSchema.index(
  { enrollment_no: 1, instituteId: 1 },
  { unique: true }
);

module.exports = mongoose.model("Student", studentSchema);