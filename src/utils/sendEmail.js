const nodemailer = require("nodemailer")

const emailConfirmation = async (email, subject, text) =>{
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            service:process.env.MAILSERVICE,
            port: process.env.MAIL_PORT,
            secure: true,
            auth:{
                user: process.env.USER_EMAIL,
                pass: process.env.USER_PASS
            }
        })

        await transporter.sendMail({
            from:  process.env.USER_EMAIL,
            to: email,
            subject: subject,
            html:text
        })

    } catch (error) {
        console.log(error)
    }
}

module.exports = emailConfirmation