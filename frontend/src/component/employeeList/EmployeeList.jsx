

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EmployeeList.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [noOfEmployee, setNoOfEmployee] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/employee/list");
        const data = response.data.employees.map(employee => {
          // Extract filename from img URL
          if (employee.img) {
            const match = employee.img.match(/[^\\/]+$/);
            employee.img = match ? match[0] : null;
          }
          return employee;
        });
        
        setEmployees(data);
        setNoOfEmployee(data.length);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  // Filter employees based on the search term
  const filteredEmployees = employees
    .filter((employee) => {
      const lowerCaseTerm = searchTerm.toLowerCase();
      return (
        employee.name.toLowerCase().includes(lowerCaseTerm) ||
        (employee.uniqueId && employee.uniqueId.toLowerCase().includes(lowerCaseTerm))
      );
    })
    .sort((a, b) => {
      const lowerCaseTerm = searchTerm.toLowerCase();
      const aNameMatchCount = (a.name.toLowerCase().match(new RegExp(lowerCaseTerm, 'g')) || []).length;
      const bNameMatchCount = (b.name.toLowerCase().match(new RegExp(lowerCaseTerm, 'g')) || []).length;
      const aUniqueIdMatchCount = (a.uniqueId && a.uniqueId.toLowerCase().match(new RegExp(lowerCaseTerm, 'g'))) || [];
      const bUniqueIdMatchCount = (b.uniqueId && b.uniqueId.toLowerCase().match(new RegExp(lowerCaseTerm, 'g'))) || [];
      
      const aTotalMatchCount = aNameMatchCount + aUniqueIdMatchCount.length;
      const bTotalMatchCount = bNameMatchCount + bUniqueIdMatchCount.length;

      return bTotalMatchCount - aTotalMatchCount;
    });

  // Handle employee removal
  const handleRemove = async (employeeId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/employee/delete/${employeeId}`);
      setEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee._id !== employeeId)
      );
      setNoOfEmployee((prev) => prev - 1);
      toast.success("Employee removed successfully!");
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Error removing employee.");
    }
  };

  // Navigate to create employee page
  const createEmployee = () => {
    navigate('/createEmployee');
  };

  // Navigate to update employee page
  const updateEmployee = (employeeId) => {
    navigate(`/updateEmployee/${employeeId}`);
  };

  return (
    <div className="employeeList-container">
      <h1>Employee List</h1>
      <div className="employeeList-header">
        <p><strong>{`Total no of employee: ${noOfEmployee}`}</strong></p>
        <input
          type="text"
          placeholder="Search by name or unique ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="employeeList-search"
        />
        <button onClick={createEmployee}>Create Employee</button>
      </div>

      <div className="employeeList-list">
        <ToastContainer />
        <table>
          <thead>
            <tr>
              <th>Unique Id</th>
              <th>Image</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile No</th>
              <th>Designation</th>
              <th>Gender</th>
              <th>Course</th>
              <th>Create Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee) => (
                <tr key={employee._id}>
                  <td>{employee._id || 'N/A'}</td>
                  <td>
                    {employee.img ? (
                      <img 
                        src={`http://localhost:5000/uploads/${employee.img}`}
                        alt="Employee"
                        style={{ width: '50px', height: '50px' }}
                      />
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>{employee.name || 'N/A'}</td>
                  <td>{employee.email || 'N/A'}</td>
                  <td>{employee.mobile || 'N/A'}</td>
                  <td>{employee.designation || 'N/A'}</td>
                  <td>{employee.gender || 'N/A'}</td>
                  <td>{employee.course || 'N/A'}</td>
                  <td>{employee.createdAt ? new Date(employee.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td >
                    <div className="table-button">
                    <button className="button-edit" onClick={() => updateEmployee(employee._id)}>Edit</button>
                    <button className="button-delete" onClick={() => handleRemove(employee._id)}>Delete</button>
                    </div>
                    
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', padding: '20px' }}>
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;
