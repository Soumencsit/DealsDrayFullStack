

import React, { useState, useRef,useContext } from 'react';
import './VerifyEmail.css';
import { Storecontext } from '../../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function VerifyEmail() {
  const {
    adminLogin,
    setAdminLogin,
    adminId,
    setAdminId,
    adminName,
    setAdminName,
    adminEmail,
    setAdminEmail,
    setAdminState
  } = useContext(Storecontext);
  const [code, setCode] = useState(Array(6).fill(""));
  const inputsRef = useRef([]);
  // const userId =  adminId; // Retrieve userId from localStorage
  const{userLogin,setUserLogin,}=useContext(Storecontext)
  const navigate=useNavigate();
  // Handle input change
  // const handleInputChange = (e, index) => {
  //   const value = e.target.value;

  //   // Only allow numeric input
  //   if (/^[0-9]$/.test(value)) {
  //     const newCode = [...code];
  //     newCode[index] = value;
  //     setCode(newCode);

  //     // Move focus to the next input
  //     if (index < 7) {
  //       inputsRef.current[index + 1].focus();
  //     }
  //   }
  // };
  const handleInputChange = (e, index) => {
    const value = e.target.value;
  
    // Only allow numeric input and update if filled
    if (/^[0-9]$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
  
      // Move focus to the next input if it's within bounds
      if (index < code.length - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    } else {
      toast.error("Only numeric values are allowed.");
    }
  };
  
  


  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      const newCode = [...code];
  
      if (code[index] !== "") {
        newCode[index] = "";
        setCode(newCode);
      } else if (index > 0) {
        newCode[index - 1] = "";  // Clear the previous box's content
        setCode(newCode);
        inputsRef.current[index - 1]?.focus(); // Use optional chaining here as well
      }
    }
  };
  

  // Handle form submission
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const otp = code.join(''); 

  //   try {
  //     const response = await axios.post('http://localhost:5000/api/admin/verifyOTP', {
  //       userId,
  //       otp
  //     });
  //     (userId);
      
  //     if (response.data.status === "VERIFIED") {
  //       setUserLogin(true)
  //       toast.success("Email verified successfully!");
  //       localStorage.removeItem('userId'); 
        
  //       navigate('/employees') 
  //     } else {
  //       toast.error(response.data.message);
  //     }
  //   } catch (error) {
      
  //     toast.error("Failed to verify the code. Please try again.");
  //   }
  // };
  const handleSubmit = async (e) => {
  e.preventDefault();
  const otp = code.join(''); 

  // Check if all fields are filled
  if (code.includes("")) {
    toast.error("Please fill in all OTP fields.");
    return;
  }

  try {
    const response = await axios.post('http://localhost:5000/api/admin/verifyOTP', {
      adminId,
      otp
    });
    (response.data.status);
    
    
    
    if (response.data.status==='VERIFIED') {
      
      
      setAdminLogin(true);
      setAdminState('Sign out')
      
      toast.success("Email verified successfully!");
      
      
      navigate('/employees'); 
    } else {
      // navigate('/employees'); 
      // toast.error(response.data.message);
    }
  } catch (error) {
    toast.error("Failed to verify the code. Please try again.");
  }
};


  return (
    <div className="verify-email-container">
    <ToastContainer/>
      <h2>Verify your email</h2>
      <p>Enter the 8-digit code you have received on <strong>{adminEmail}</strong></p>
      <form onSubmit={handleSubmit}>
        <div className="code-inputs">
          {code.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleInputChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="code-input"
              ref={(el) => (inputsRef.current[index] = el)} // Store reference to input element
            />
          ))}
        </div>
        <button type="submit" className="verify-button">VERIFY</button>
      </form>
    </div>
  );
}

export default VerifyEmail;
