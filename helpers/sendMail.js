
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  port: 465,               // true for 465, false for other ports
  host: "smtp.gmail.com",
     auth: {
          user: 'realestatecbe7901@gmail.com',
          pass: 'nnielhzdtqxpuydr',
       },
  secure: true,
  });
    const sendMail=async (mailOptions)=>{
try {
    const sentMail = await transporter.sendMail(mailOptions)
    console.log("Mail sent successfully",sentMail)
} catch (error) {
  console.log("Mail error: " , error)  
}
    }

   module.exports ={ sendMail }