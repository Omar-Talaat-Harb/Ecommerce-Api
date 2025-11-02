// nodemailer
const nodemailer = require('nodemailer');
const sendEmail = async (options)=>{
  // 1) Create transporter (service that will send email 'gmail','mailgun')
  const transporter = nodemailer.createTransport({
    host:process.env.EMAIL_HOST,
    port:process.env.EMAIL_PORT, //if secure false port = 587 ,if true 465
    secure:false,
    auth:{
      user:process.env.EMAIL_USER,
      pass:process.env.EMAIL_PASSWORD
    }
  })
  // 2) Define email options (email content)
  const mailOptions = {
    from: 'Ecommerce Api ',
    to:options.email,
    subject:options.subject,
    text:options.message
  }
  // 3) Send email
  await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;