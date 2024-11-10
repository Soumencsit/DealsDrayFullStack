
import React, { useState, useContext } from "react";
import {
  BoldLink,
  BoxContainer,
  FormContainer,
  Input,
  LineText,
  MutedLink,
  SubmitButton,
} from "./common";




import { Marginer } from "../marginer";
import axios from "axios";
import { AccountContext } from "./accountContext";
import { toast, ToastContainer } from "react-toastify";
import { Storecontext } from '../../context/AdminContext'; 
import { useNavigate } from "react-router-dom";
export function LoginForm(props) {
    const {
    adminLogin,
    setAdminLogin,
    adminId,
    setAdminId,
    adminName,
    setAdminName,
    setAdminState
  } = useContext(Storecontext);

  const navigate=useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { switchToSignup } = useContext(AccountContext);

  const handleLogin = async (e) => {
    
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/admin/login", {
        email,
        password,
      });
      

      if (response.data.success) {
        setAdminLogin(true);
        setAdminState('Sign out')
        setAdminId(response.data._id);
        setAdminName(response.data.name);
        toast.success("Login Successful")
        navigate('/employees')
        
        setEmail('');
        setPassword('');
        
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (err) {
      setError("An error occurred during login.");
      console.error(err);
    }
  };

  return (
    <BoxContainer>
      <ToastContainer />
      {/* Ensure FormContainer wraps both inputs and SubmitButton */}
      <FormContainer onSubmit={handleLogin}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <SubmitButton type="submit">Signin</SubmitButton>
        </FormContainer>
        <Marginer direction="vertical" margin={10} />
        {/* <MutedLink href="#">Forget your password?</MutedLink> */}
        <Marginer direction="vertical" margin="1.6em" />
        {/* Ensure type="submit" is explicitly added */}
        
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Marginer direction="vertical" margin="5px" />
      <LineText>
        Don't have an account?{" "}
        <BoldLink onClick={switchToSignup} href="#">
          Signup
        </BoldLink>
      </LineText>
    </BoxContainer>
  );
}
