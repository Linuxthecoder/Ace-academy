const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const { body, validationResult } = require("express-validator");

const app = express();
app.use(express.json());

// Environment variables
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://Nexora:7Ib1bRpd3RtXe0nV@galaxycluster01.8pz68zq.mongodb.net/AceAcademyDB?retryWrites=true&w=majority&appName=Galaxycluster01";

// CORS Configuration
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:4000",
    "https://www-aceacademy-com.onrender.com"
];
app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

// Static file support (optional)
app.use(express.static(path.join(__dirname, "frontend")));

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000
})
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// Schemas with validation and timestamps
const EnrollmentSchema = new mongoose.Schema({
    studentName: { type: String, required: true, trim: true },
    dob: { type: String, required: true },
    gender: { type: String, required: true, enum: ["Male", "Female"] },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    fatherName: { type: String, required: true, trim: true },
    fatherQualification: { type: String, required: true, trim: true },
    fatherOccupation: { type: String, required: true, trim: true },
    motherName: { type: String, required: true, trim: true },
    motherQualification: { type: String, required: true, trim: true },
    motherOccupation: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"] },
    phone: { type: String, required: true, trim: true, match: [/^\+\d{1,4}\d{6,14}$/, "Please enter a valid phone number with country code"] },
    previousSchool: { type: String, required: true, trim: true },
    lastClass: { type: String, required: true, trim: true },
    admissionClass: { type: String, required: true, trim: true },
    percentage: { type: String, required: true, trim: true },
    timestamp: { type: String, required: true }
}, { timestamps: true });

const TeacherApplicationSchema = new mongoose.Schema({
    applicantName: { type: String, required: true, trim: true },
    dob: { type: String, required: true },
    gender: { type: String, required: true, enum: ["Male", "Female"] },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"] },
    phone: { type: String, required: true, trim: true, match: [/^\+\d{1,4}\d{6,14}$/, "Please enter a valid phone number with country code"] },
    qualification: { type: String, required: true, trim: true },
    subjectSpecialization: { type: String, required: true, trim: true },
    teachingExperience: { type: Number, min: 0 },
    previousInstitution: { type: String, trim: true },
    positionHeld: { type: String, trim: true },
    preferredClass: { type: String, required: true, trim: true },
    timestamp: { type: String, required: true }
}, { timestamps: true });

const Enrollment = mongoose.model("Enrollment", EnrollmentSchema);
const TeacherApplication = mongoose.model("TeacherApplication", TeacherApplicationSchema);

// Validation middleware for enrollment
const validateEnrollment = [
    body("studentName").trim().notEmpty().withMessage("Student name is required"),
    body("dob").notEmpty().withMessage("Date of birth is required"),
    body("gender").isIn(["Male", "Female"]).withMessage("Gender must be Male or Female"),
    body("address").trim().notEmpty().withMessage("Address is required"),
    body("city").trim().notEmpty().withMessage("City is required"),
    body("state").trim().notEmpty().withMessage("State is required"),
    body("country").trim().notEmpty().withMessage("Country is required"),
    body("fatherName").trim().notEmpty().withMessage("Father's name is required"),
    body("fatherQualification").trim().notEmpty().withMessage("Father's qualification is required"),
    body("fatherOccupation").trim().notEmpty().withMessage("Father's occupation is required"),
    body("motherName").trim().notEmpty().withMessage("Mother's name is required"),
    body("motherQualification").trim().notEmpty().withMessage("Mother's qualification is required"),
    body("motherOccupation").trim().notEmpty().withMessage("Mother's occupation is required"),
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("phone").matches(/^\+\d{1,4}\d{6,14}$/).withMessage("Please enter a valid phone number with country code"),
    body("previousSchool").trim().notEmpty().withMessage("Previous school is required"),
    body("lastClass").trim().notEmpty().withMessage("Last class attended is required"),
    body("admissionClass").trim().notEmpty().withMessage("Admission class is required"),
    body("percentage").trim().notEmpty().withMessage("Percentage/grade is required"),
    body("timestamp").notEmpty().withMessage("Timestamp is required")
];

// Validation middleware for teacher application
const validateTeacherApplication = [
    body("applicantName").trim().notEmpty().withMessage("Applicant name is required"),
    body("dob").notEmpty().withMessage("Date of birth is required"),
    body("gender").isIn(["Male", "Female"]).withMessage("Gender must be Male or Female"),
    body("address").trim().notEmpty().withMessage("Address is required"),
    body("city").trim().notEmpty().withMessage("City is required"),
    body("state").trim().notEmpty().withMessage("State is required"),
    body("country").trim().notEmpty().withMessage("Country is required"),
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("phone").matches(/^\+\d{1,4}\d{6,14}$/).withMessage("Please enter a valid phone number with country code"),
    body("qualification").trim().notEmpty().withMessage("Highest qualification is required"),
    body("subjectSpecialization").trim().notEmpty().withMessage("Subject specialization is required"),
    body("teachingExperience").optional().isInt({ min: 0 }).withMessage("Teaching experience must be a non-negative number"),
    body("previousInstitution").optional().trim(),
    body("positionHeld").optional().trim(),
    body("preferredClass").trim().notEmpty().withMessage("Preferred class to teach is required"),
    body("timestamp").notEmpty().withMessage("Timestamp is required")
];

// Routes
app.post("/submit", validateEnrollment, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }

        const newEnrollment = new Enrollment(req.body);
        await newEnrollment.save();
        res.status(200).json({ message: "Enrollment successful!" });
    } catch (error) {
        console.error("❌ Error processing enrollment:", error);
        res.status(500).json({ message: "Error processing enrollment: " + error.message });
    }
});

app.post("/submit-teacher-application", validateTeacherApplication, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }

        const newTeacherApplication = new TeacherApplication(req.body);
        await newTeacherApplication.save();
        res.status(200).json({ message: "Teacher application submitted successfully!" });
    } catch (error) {
        console.error("❌ Error processing teacher application:", error);
        res.status(500).json({ message: "Error processing teacher application: " + error.message });
    }
});

// Fallback route (for undefined routes)
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));