import nodemailer from 'nodemailer';
const sendEmail = async () => {
    let testAccount = await nodemailer.createTestAccount();
    try {
        const testAccount = await nodemailer.createTestAccount();

        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });

        const info = await transporter.sendMail({
            from: testAccount.user,
            to: 'recipient@example.com',
            subject: 'Subject',
            text: 'Message body',
        });
        

        console.log("email sent sucessfully");
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (error) {
        if (error.code === 'EAUTH') {
            console.log('Invalid username or password');
        } else {
            console.log('Error:', error, 'Email not sent');
        }
    }

};

export default sendEmail;