import { sendEmail } from "./sendEmail.js";
import { genVerificationOtpTemp } from "./emailTemplet.js";

export const sendVerificationCode = async (verificationCode, email) => {
    const message = genVerificationOtpTemp(verificationCode);
    
    await sendEmail({
        email: email,
        subject: "Email Verification OTP - BookWorm Library",
        message,
    });
    
    console.log(`✅ Verification code sent to ${email}`);
    return { success: true, message: `Verification code sent to ${email}` };
};