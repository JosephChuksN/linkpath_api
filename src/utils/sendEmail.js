const nodemailer = require("nodemailer")

const emailConfirmation = async (email, subject, text) =>{
    try {
        const transporter = nodemailer.createTransport({
            host: "smt.gmail.com",
            service:"gmail",
            port: 587,
            secure: true,
            auth:{
                user: "eneitodo2019@gmail.com",
                pass: "opwjfsgmclackciw"
            }
        })

        await transporter.sendMail({
            from: "eneitodo2019@gmail.com",
            to: email,
            subject: subject,
            text:text
        })

    } catch (error) {
        console.log(error)
    }
}

module.exports = emailConfirmation