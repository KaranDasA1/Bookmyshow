const nodemailer = require('nodemailer');
const fs = require("fs");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();

const { EMAIL_USER, EMAIL_PASS } = process.env;

function replaceContent(content, creds) {
    let allkeysArr = Object.keys(creds);
    allkeysArr.forEach(function (key) {
        content = content.replace(`#{${key}}`, creds[key]);
    })

    return content;
}
async function EmailHelper(templateName, receiverEmail, creds) {
    try {
        const templatePath = path.join(__dirname, "email_templates", templateName);
        let content = await fs.promises.readFile(templatePath, "utf-8");
        const emailDetails = {
            to: receiverEmail,
            from: EMAIL_USER, , // Change to your verified sender
            subject: 'RESET OTP',
           text: `Hi ${creds.name} this is your reset OTP: ${creds.otp}`,
            html: replaceContent(content, creds),
        }
        const transportDetails = {
          host: 'smtp.gmail.com',
            port: 587,
            secure: false
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS
            }
        }

        const transporter = nodemailer.createTransport(transportDetails);
        await transporter.sendMail((emailDetails))
        console.log("email sent")
    } catch (err) {
        console.log(err)
    }

}

module.exports = EmailHelper;
