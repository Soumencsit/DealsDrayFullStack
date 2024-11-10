
import express from 'express'

import  { getAllEmployees,addEmployee,deleteEmployee,updateEmployee,getEmployeeById}  from '../controllers/employeeController.js'
const createRouter=express.Router()

createRouter.get('/list',getAllEmployees)
createRouter.post('/add',addEmployee)
createRouter.delete('/delete/:employeeId',deleteEmployee)
createRouter.put('/updateEmployee/:id', updateEmployee)
createRouter.get('/getEmployeeById/:employeeId', getEmployeeById )


export default createRouter
