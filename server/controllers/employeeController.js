import employeeModel from '../model/employeeModel.js';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';

// Get the current directory from the module's URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the upload directory
const uploadDir = path.join(__dirname, 'uploads');

// Create the 'uploads' folder if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use the defined uploadDir for storing uploaded files
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Ensure the filename is unique by adding a timestamp
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Multer middleware for file upload
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Only JPG and PNG files are allowed!'), false);
    }
  },
});



const addEmployee = async (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });

    const { name, email, mobile, designation, gender, course } = req.body;
    const img = req.file ? req.file.path : null; // Store image file path

    if (!name || !email || !mobile || !designation || !gender || !course) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      const newEmployee = new employeeModel({
        name,
        email,
        mobile,
        designation,
        gender,
        course,
        img, // Save img path
      });

      const savedEmployee = await newEmployee.save();
      res.status(200).json({
        success: true,
        message: "Employee added successfully",
        employee: savedEmployee,
        imgUrl: `http://localhost:5000/${img}`, // Include image URL in the response
      });
    } catch (error) {
      console.error("Error saving employee data:", error); // Log the error
      res.status(500).json({ error: "Error saving employee data", details: error.message });
    }
  });
};



const getAllEmployees = async (req, res) => {
  try {
    const employees = await employeeModel.find(); // Fetch all employee records from the database

    // Map through the employees and prepend the base URL to image paths
    const employeesWithFullImageUrl = employees.map((employee) => {
      if (employee.img) {
        employee.img = `http://localhost:5000/uploads/${employee.img}`; // Prepend the base URL to image path
      }
      return employee;
    });

    res.status(200).json({
      success: true,
      employees: employeesWithFullImageUrl, // Send modified employee data with full image URLs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching employees",
      error: error.message,
    });
  }
};


// Get employee by ID
const getEmployeeById = async (req, res) => {
  const { employeeId } = req.params; // Get the employeeId from the request parameters
  
  try {
    const employee = await employeeModel.findById(employeeId); // Find the employee by ID
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee fetched successfully",
      employee,
    });
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching employee",
      error: error.message,
    });
  }
};

// Delete an employee by ID
const deleteEmployee = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const deletedEmployee = await employeeModel.findByIdAndDelete(employeeId); // Find and delete the employee
    
    if (!deletedEmployee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
      employee: deletedEmployee,
    });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting employee",
      error: error.message,
    });
  }
};

// Update employee API route
const updateEmployee = async (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });

    const { name, email, mobile, designation, gender, course } = req.body;
    const img = req.file ? req.file.path : undefined;

    try {
      const updatedEmployee = await employeeModel.findByIdAndUpdate(
        req.params.id,
        { name, email, mobile, designation, gender, course, ...(img && { img }) },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: "Employee updated successfully",
        employee: updatedEmployee,
      });
    } catch (error) {
      res.status(500).json({ error: "Error updating employee" });
    }
  });
};

export { addEmployee, getAllEmployees, deleteEmployee, updateEmployee, getEmployeeById };
