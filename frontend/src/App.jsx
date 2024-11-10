import {React,useContext} from "react";
import './App.css'
import AccountBox from "./component/accountBox/index";
import Navbar from "./component/navbar/NavBar";
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import CreateEmployee from "./component/createEmployee/CreateEmployee";
// import UpdateEmployee from "./component/updateEmployee/UpdateEmployee";
import EmployeeList from "./component/employeeList/EmployeeList";
import VerifyEmail from "./component/verifyPassword/VerifyEmail";
import UpdateEmployee from './component/updateEmployee/UpdateEmployee'
import { Storecontext } from "./context/AdminContext";
import { toast, ToastContainer } from "react-toastify";
export default function App() {

  const {
    adminLogin,
  } = useContext(Storecontext);
  return (

   

    <BrowserRouter>
    <Navbar/>
    <ToastContainer/>
  
   
    <div className="app-container">
     <Routes>
     <Route path='/' element={<AccountBox/>}/>
      <Route path="/signup" element={<AccountBox/>}/>
      <Route path="/verifyEmail" element={<VerifyEmail/>}/>
      <Route path="/employees"
       element={adminLogin?
       <EmployeeList/>:
       
       <AccountBox/>


       }/>
      <Route path="/createEmployee" element={adminLogin?<CreateEmployee/>:<AccountBox/>}/>
      <Route path="/updateEmployee/:id" element={adminLogin?<UpdateEmployee />:<AccountBox/>} />

     </Routes>

      
    </div>

    </BrowserRouter> 

 
  
  );
}
