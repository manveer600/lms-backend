import nodemailer from 'nodemailer';
const sendEmail = async (email, subject, message) => {
    try {
        const transporter = nodemailer.createTransport({
            service:'gmail',
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: process.env.SMTP_USERNAME,
            to: email,
            subject: subject,
            html: message,
        });

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

export default sendEmail;