const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const dashboardRoutes = require("./routes/dashboardRoutes");
const cors = require("cors");
const feedRoutes = require("./routes/feed");
const jobRoutes = require("./routes/jobs");
const postRoutes = require("./routes/posts");
const eventRoutes = require("./routes/events");
const studentExtraRoutes = require("./routes/studentExtra");
const instituteRoutes = require("./routes/institute");

dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

const uploadExcelRoutes = require("./routes/uploadExcel");
app.use("/api/admin", uploadExcelRoutes);

const adminStudentRoutes = require("./routes/adminStudents");
app.use("/api/admin", adminStudentRoutes);

app.use("/api", feedRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/students", studentExtraRoutes);
app.use("/api/institute", instituteRoutes);

app.get("/", (req, res) => {
  res.send("Backend running with DB");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
