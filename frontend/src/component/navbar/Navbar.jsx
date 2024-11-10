import React, { useState,useContext } from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink
import './Navbar.css'; // Import the CSS file
import logo from '../../assets/logo_B2R.png';
import { Storecontext } from "../../context/AdminContext";
import Home from '../home/Home';
import { useNavigate } from 'react-router-dom';
function Navbar() {
  const {
    adminLogin,
    setAdminLogin,
    adminId,
    adminName,
    setAdminName,
    adminState,
    setAdminState

  } = useContext(Storecontext);
  const navigate=useNavigate()
  const [name,setName] =useState('Soumen')
  
  const signinFun=()=>{
   
    // if(adminLogin==='Sign out'){
      (adminState);
       localStorage.clear()
       setAdminState('Sign in')
       setAdminLogin(false)
       setAdminName('')
       
       navigate('/')
    // }
    
  }
  
  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="B2R Logo" />
      </div>
      <div className="nav-links">
      {adminLogin?
      <ul className="nav-links">
       
       <li><NavLink to="/" >Home</NavLink></li>
       <li><NavLink to="/employees" >Employee List</NavLink></li>
       
      </ul>
      :<h2 className='AdminPortal-h1'>Welcome To Admin Portal</h2>}
      </div>
      <div className='navbar-right'>
        <p><strong>Hi👋{adminName}</strong></p>
        <NavLink to="/signup"><button
         className="download-button"
         onClick={()=>{signinFun()}}
        >{adminState}</button></NavLink>
      </div>
    
    </nav>
  );
}

export default Navbar;
