import React, { useState } from 'react';
import './CreateEmployee.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  // Import axios to make HTTP requests

const CreateEmployee = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    designation: '',
    gender: '',
    course: [],
    file: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  // Regular expressions for validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobileRegex = /^[0-9]+$/;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        course: checked ? [...prev.course, value] : prev.course.filter((course) => course !== value),
      }));
    } else if (type === 'file') {
      setFormData((prev) => ({ ...prev, [name]: e.target.files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Enter a valid email';
    }
    if (!formData.mobile) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!mobileRegex.test(formData.mobile)) {
      newErrors.mobile = 'Enter a valid mobile number';
    }
    if (!formData.designation) newErrors.designation = 'Designation is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (formData.course.length === 0) newErrors.course = 'Select at least one course';
    if (!formData.file) {
      newErrors.file = 'Image file is required';
    } else if (!['image/jpeg', 'image/png'].includes(formData.file.type)) {
      newErrors.file = 'Only jpg/png files are allowed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitted(true);
  
      // Create FormData object to send as multipart form data
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('name', formData.name);
      formDataToSubmit.append('email', formData.email);
      formDataToSubmit.append('mobile', formData.mobile);
      formDataToSubmit.append('designation', formData.designation);
      formDataToSubmit.append('gender', formData.gender);
      formDataToSubmit.append('course', JSON.stringify(formData.course));  // Convert array to JSON string
  
      // Add file to formData (if exists)
      if (formData.file) {
        formDataToSubmit.append('file', formData.file);
      }
      // console.log(formData);
      
  
      try {
        // Send POST request to the backend
        const response = await axios.post('http://localhost:5000/api/employee/add', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }, // Important for file uploads
        });
  
        console.log('Employee created successfully:', response.data);
        setFormData({
          name: '',
          email: '',
          mobile: '',
          designation: '',
          gender: '',
          course: [],
          file: null,
        });
  
        // Navigate to employee list or reset form
        navigate('/employees');
      } catch (error) {
        console.error('Error creating employee:', error);
        setIsSubmitted(false);
      }
    } else {
      setIsSubmitted(false);
    }
  };
  
  return (
    <div className="form-container">
      <h2>Create Employee</h2>
      {isSubmitted && <p className="success">Form submitted successfully!</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
        />
        {errors.name && <span className="error">{errors.name}</span>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
        />
        {errors.email && <span className="error">{errors.email}</span>}

        <input
          type="text"
          name="mobile"
          placeholder="Mobile No"
          value={formData.mobile}
          onChange={handleInputChange}
        />
        {errors.mobile && <span className="error">{errors.mobile}</span>}

        <select name="designation" value={formData.designation} onChange={handleInputChange}>
          <option value="">Select Designation</option>
          <option value="HR">HR</option>
          <option value="Manager">Manager</option>
          <option value="Sales">Sales</option>
        </select>
        {errors.designation && <span className="error">{errors.designation}</span>}

        <div className="gender">
          <label>
            <input type="radio" name="gender" value="M" onChange={handleInputChange} />
            Male
          </label>
          <label>
            <input type="radio" name="gender" value="F" onChange={handleInputChange} />
            Female
          </label>
          {errors.gender && <span className="error">{errors.gender}</span>}
        </div>

        <div className="course">
          <label>
            <input type="checkbox" name="course" value="MCA" onChange={handleInputChange} />
            MCA
          </label>
          <label>
            <input type="checkbox" name="course" value="BCA" onChange={handleInputChange} />
            BCA
          </label>
          <label>
            <input type="checkbox" name="course" value="BSC" onChange={handleInputChange} />
            BSC
          </label>
          {errors.course && <span className="error">{errors.course}</span>}
        </div>

        <input type="file" name="file" onChange={handleInputChange} />
        {errors.file && <span className="error">{errors.file}</span>}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateEmployee;
