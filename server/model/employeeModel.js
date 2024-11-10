import mongoose from "mongoose";

// Employee Schema
const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Invalid email format'],
  },
  mobile: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Invalid mobile number'],
  },
  designation: {
    type: String,
    enum: ['HR', 'Manager', 'Sales'],
    required: true,
  },
  gender: {
    type: String,
    enum: ['M', 'F'],
    required: true,
  },
  course: {
    type: [String],
    enum: ['MCA', 'BCA', 'BSC'],
    required: true,
  },
  img: { type: String },  // Now storing the path to the image
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const employeeModel = mongoose.models.Employee || mongoose.model('Employee', employeeSchema);

export default employeeModel;
