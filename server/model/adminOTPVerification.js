import mongoose from "mongoose";

const { Schema } = mongoose;

const AdminOTPVerificationSchema = new Schema({
    adminId: String,
    otp: String,
    createdAt: Date,
    expiresAt: Date,
});

const adminOTPVerification =mongoose.model.adminOTPVerification|| mongoose.model("adminOTPVerification", AdminOTPVerificationSchema);

export default adminOTPVerification;

