import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    // Course field
    course: {
      type: String,
      required: true,
      enum: [
        "BTech", "MTech", "BCA", "MCA", "BSc", "MSc",
        "BBA", "MBA", "PhD", "Diploma", "B.Pharma", "M.Pharma"
      ],
      default: "BTech",
    },
    // Branch field
    branch: {
      type: String,
      required: true,
      enum: [
        "CSE", "CS", "IT", "ECE", "EE", "ME", "CE",
        "Civil", "Mechanical", "Electrical", "Electronics",
        "Diploma CS", "Diploma IT", "Diploma EC", "Diploma EE", "Diploma ME",
        "Pharmaceutics", "Pharmacology", "Pharmaceutical Chemistry",
        "Pharmacognosy", "Clinical Pharmacy", "Pharmacy Practice"
      ],
      default: "CSE",
    },
    // Semester field
    semester: {
      type: Number,
      min: 1,
      max: 8,
      default: null,
    },
    // Year field (for Diploma and Pharmacy)
    year: {
      type: Number,
      min: 1,
      max: 4,
      default: null,
    },
    // Subject field
    subject: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Book = mongoose.model("Book", bookSchema);