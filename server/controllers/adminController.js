import adminModel from "../model/adminModel.js";
import adminOTPVerification from '../model/adminOTPVerification.js'
import 'dotenv/config';
import bcrypt from 'bcrypt'
import validator from 'validator'
import nodemailer from "nodemailer";


let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    secure:true,
    auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD

    }
});



//teating success
transporter.verify((error, success) => {
    if (error) {
        console.error("Error connecting to the email service:", error); // Improved logging
    } else {
        ("Ready for message:", success);
    }
});

// Login
const loginAdmin=async(req,res)=>{
    const{email,password}=req.body;
    try{
        const admin=await adminModel.findOne({email})
            if(!admin){
                return res.json({success:false,massage:"admin Doesn't exist"})
            }    
        const isMatch=await bcrypt.compare(password,admin.password)
        if(!isMatch){
            return res.json({success:false,massage:"Invalid credential"})
        }      
        res.json({success:true,_id: admin._id.toString() ,name:admin.name.toString()})
    }   
    catch(err){
        res.json({success:false,massage:"ERROR"})
    }
}




const verifyOTP = async (req, res) => {
    try {
        const { adminId, otp } = req.body;

        // Validate input
        (adminId,otp);
        
        if (!adminId || !otp) {
            return res.json({ status: "FAILED", message: "Empty OTP details are not allowed" });
        }

        // Fetch the OTP verification record
        const adminOTPVerificationRecord = await adminOTPVerification.findOne({ adminId });
        (adminOTPVerificationRecord);
        
        if (!adminOTPVerificationRecord) {
            // No record found
            return res.json({
                status: "FAILED",
                message: "Account record doesn't exist or has been verified already. Please sign up or log in"
            });
        }

        const { expiresAt, otp: hashedOTP } = adminOTPVerificationRecord;
        
        // Check if OTP has expired
        if (expiresAt < Date.now()) {
            // Delete the expired OTP record
            await adminOTPVerification.deleteMany({ adminId });
            return res.json({ status: "FAILED", message: "Code has expired. Please request again" });
        }

        // Verify the OTP
        const validOTP = await bcrypt.compare(otp, hashedOTP);
        if (!validOTP) {
            return res.json({ status: "FAILED", message: "Invalid code passed. Check your inbox" });
        }

        // Fetch the admin record
        const adminRecord = await adminModel.findById(adminId);
        
        if (!adminRecord) {
            return res.json({ status: "FAILED", message: "Admin does not exist." });
        }

        if (adminRecord.isVerified) {
            return res.json({ status: "FAILED", message: "Admin account has already been verified." });
        }

        // Update the admin record to verified
        adminRecord.isVerified = true;
        await adminRecord.save();

        // Delete OTP record after successful verification
        await adminOTPVerification.deleteMany({ adminId });

        // Send success response
        res.json({
            status: "VERIFIED",
            message: "Admin email verified successfully"
        });
    } catch (error) {
        console.error("Error in verifyOTP:", error.message);
        res.json({
            status: "FAILED",
            message: error.message,
        });
    }
};



//resend verification
const resendOTPVerificationCode= async (req, res) => {
    try{
        let { adminId, email } = req.body;
        
        if( !adminId || !email) {
            throw Error("empty admin details are not allowed");
        } else {
            //deleting existing records and re-send
            await adminOTPVerification.deleteMany({ adminId });
            sendOTPVerificationEmail({_id: adminId, email }, res);
        }

    }catch (error) {
        res.json({
            status: "FAILED",
            message: error.message,
        });
    }
};


const createToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET)

}

//send otp verification email
const sendOTPVerificationEmail = async ({ _id, email }, res) => {
    try {
        const otp = `${Math.floor(100000 + Math.random() * 900000)}`;

        // Email options
        const mailOptions = {
            from: "sp01csit@gmail.com",
            to: email,
            subject: "Verify Your Email",
            html: `<p>Enter ${otp} in the app to verify your email address and complete the sign-up process.</p><p>This code <b>expires in 1 hour</b>.</p>`,
        };

        // Hash the OTP
        const saltRounds = 10;
        const hashedOTP = await bcrypt.hash(otp, saltRounds);

        // Create and save a new OTP verification record
        const newOTPVerification = new adminOTPVerification({
            adminId: _id,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
        });

        await newOTPVerification.save();
        await transporter.sendMail(mailOptions);

       
        return {
            status: "PENDING",
            message: "Verification OTP email sent",
            data: { adminId: _id, email },
        };
    } catch (error) {
        return {
            status: "FAILED",
            message: error.message,
        };
    }
};



const signUpAdmin = async (req, res) => {
    const { name, password, email } = req.body;

    try {
        const exist = await adminModel.findOne({ email });
        if (exist) {
            return res.json({ Success: false, message: "admin already exists" });
        }
        if (!validator.isEmail(email)) {
            return res.json({ Success: false, message: "Please Enter a valid Email" });
        }
        if (password.length < 8) {
            return res.json({ Success: false, message: "Please Enter a Strong Password" });
        }

        // Check password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const newadmin = new adminModel({
            name: name,
            email: email,
            password: hashPassword
        });

        const admin = await newadmin.save();
        (admin);
        
        // Send OTP Verification Email and wait for the response
        const otpResponse = await sendOTPVerificationEmail(admin, res);
        
        // Check the response from sendOTPVerificationEmail
        if (otpResponse.status === "FAILED") {
            return res.json(otpResponse); // If sending OTP failed, return that response
        }
        
        // If successful, respond with success
        res.json({ Success: true, message: "admin created and OTP sent", data: otpResponse,adminId:admin._id });

    } catch (error) {
       
        res.json({ Success: false, message: "Error" });
    }
};



export {loginAdmin,signUpAdmin,verifyOTP,resendOTPVerificationCode,sendOTPVerificationEmail};
