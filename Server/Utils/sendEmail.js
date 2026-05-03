
import nodeMailer from "nodemailer";

export const sendEmail = async ({ email, subject, message }) => {
    console.log(`📧 Sending email to: ${email}`);
    console.log(`📧 Subject: ${subject}`);
    
    try {
        const transporter = nodeMailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT),
            secure: false,
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });
        
        const mailOptions = {
            from: `"BookWorm Library" <${process.env.SMTP_MAIL}>`,
            to: email,
            subject: subject,
            html: message,
        };
        
        const info = await transporter.sendMail(mailOptions);
        console.log(` Email sent successfully! Message ID: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error(` Email error: ${error.message}`);
        throw new Error(`Email sending failed: ${error.message}`);
    }
};