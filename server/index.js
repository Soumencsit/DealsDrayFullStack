import express from 'express';
import 'dotenv/config';

import multer from 'multer';
import { connectDB } from './config/db.js';
import employeeRoute from './router/employeeRoute.js';
import adminRoute from './router/adminRoute.js'
const app = express();
const PORT = process.env.PORT; 

import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('controllers'))






const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));








app.use("/api/employee",employeeRoute)
app.use("/api/admin",adminRoute)




connectDB()

// Starting the server
app.listen(PORT, () => {
    console.log(`App Running Successfully on PORT ${PORT}`);
});