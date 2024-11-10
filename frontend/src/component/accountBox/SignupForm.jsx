import React, { useState, useContext } from "react";
import {useNavigate} from 'react-router-dom'
import {
  BoldLink,
  BoxContainer,
  FormContainer,
  Input,
  LineText,
  SubmitButton,
} from "./common";
import { Marginer } from "../marginer";
import { AccountContext } from "./accountContext";
import { Storecontext } from "../../context/AdminContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export function SignupForm(props) {
  // State for form fields and error/success messages

  const {
    adminLogin,
    setAdminLogin,
    adminId,
    setAdminId,
    adminName,
    setAdminName,
    adminEmail,
    setAdminEmail
  } = useContext(Storecontext);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate=useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { switchToSignin } = useContext(AccountContext);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { fullName, email, password, confirmPassword } = formData;

    // Simple validation
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      const loadingToast = toast.loading("Creating your account...");
      // Send signup request to backend
      const response = await axios.post("http://localhost:5000/api/admin/signup", {
        name: fullName,
        email,
        password,
      });
      toast.dismiss(loadingToast);
      (response);
      
      if (response.data.Success) {
        setAdminId(response.data.adminId)
        setAdminEmail(email)
        setAdminName(fullName)
        toast.success("Signup successful! Please check your email for the verification code.");
        
        navigate("/verifyemail"); 
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      setError("An error occurred during signup.");
      
    }
  };

  return (
    <BoxContainer>
      <ToastContainer />
      {/* Form wrapper with onSubmit */}
      <FormContainer onSubmit={handleSignup}>
        <Input
          type="text"
          name="fullName"
          placeholder="Full name"
          value={formData.fullName}
          onChange={handleChange}
        />
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <Input
          type="password"
          name="confirmPassword"
          placeholder="Confirm password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {/* Ensure SubmitButton is inside FormContainer */}
        <SubmitButton type="submit">Signup</SubmitButton>
      </FormContainer>
      <Marginer direction="vertical" margin={10} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Marginer direction="vertical" margin="5px" />
      <LineText>
        Already have an account?{" "}
        <BoldLink onClick={switchToSignin} href="#">
          Signin
        </BoldLink>
      </LineText>
    </BoxContainer>
  );
}
