import React, { useState, useEffect} from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UpdateEmployee = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    designation: "",
    gender: "",
    course: [],
    file: null,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const navigate = useNavigate();


  // Fetch employee data based on ID when component mounts
  const { id } = useParams(); // Get the employee ID from the URL

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/employee/getEmployeeById/${id}`);
        (response);
        
        setFormData(response.data.employee); // Set the employee data in the form
      } catch (error) {
        console.error("Error fetching employee:", error);
      }
    };
  
    fetchEmployee();
  }, [id]); // Dependency on `id` ensures it fetches data whenever the `id` changes
  

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      if (checked) {
        setFormData((prev) => ({ ...prev, course: [...prev.course, value] }));
      } else {
        setFormData((prev) => ({
          ...prev,
          course: prev.course.filter((course) => course !== value),
        }));
      }
    } else if (type === "radio") {
      setFormData((prev) => ({ ...prev, gender: value }));
    } else if (type === "file") {
      setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.mobile || !formData.designation || !formData.gender || !formData.course.length) {
      setErrors({
        name: !formData.name ? "Name is required" : "",
        email: !formData.email ? "Email is required" : "",
        mobile: !formData.mobile ? "Mobile is required" : "",
        designation: !formData.designation ? "Designation is required" : "",
        gender: !formData.gender ? "Gender is required" : "",
        course: formData.course.length === 0 ? "At least one course must be selected" : "",
      });
      return;
    }

    // Prepare form data for update
    // const formDataToSend = new FormData();
    // formDataToSend.append("name", formData.name);
    // formDataToSend.append("email", formData.email);
    // formDataToSend.append("mobile", formData.mobile);
    // formDataToSend.append("designation", formData.designation);
    // formDataToSend.append("gender", formData.gender);
    // formDataToSend.append("course", JSON.stringify(formData.course)); // Send course as stringified array
    // if (formData.file) {
    //   formDataToSend.append("file", formData.file);
    // }

    try {
      // Send the PUT request to update the employee
      const response = await axios.put(`http://localhost:5000/api/employee/updateEmployee/${id}`, formData);
      (response.data);
      setIsSubmitted(true);
      navigate("/employees"); // Redirect after success
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  return (
    <div className="form-container">
      <h2>Update Employee</h2>
      {isSubmitted && <p className="success">Employee updated successfully!</p>}
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
            <input type="radio" name="gender" value="M" checked={formData.gender === "M"} onChange={handleInputChange} />
            Male
          </label>
          <label>
            <input type="radio" name="gender" value="F" checked={formData.gender === "F"} onChange={handleInputChange} />
            Female
          </label>
          {errors.gender && <span className="error">{errors.gender}</span>}
        </div>

        <div className="course">
          <label>
            <input type="checkbox" name="course" value="MCA" checked={formData.course.includes("MCA")} onChange={handleInputChange} />
            MCA
          </label>
          <label>
            <input type="checkbox" name="course" value="BCA" checked={formData.course.includes("BCA")} onChange={handleInputChange} />
            BCA
          </label>
          <label>
            <input type="checkbox" name="course" value="BSC" checked={formData.course.includes("BSC")} onChange={handleInputChange} />
            BSC
          </label>
          {errors.course && <span className="error">{errors.course}</span>}
        </div>

        <input type="file" name="file" onChange={handleInputChange} />
        {errors.file && <span className="error">{errors.file}</span>}

        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdateEmployee;
