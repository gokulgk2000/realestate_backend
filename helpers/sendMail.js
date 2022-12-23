
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
  const mailData = {
    from: 'realestatecbe7901@gmail.com',  // sender address
      to: 'krishnakumars59809@gmail.com',   // list of receivers
      subject: 'Seller has Register the Property',
      text: 'You have a New Property!',
      html: '<b>Property Has Registered</b> <br> please Verify the Property <br/>',
    };
   console.log("initiating") 
    const sendMail=async ()=>{
try {
    const sentMail = await transporter.sendMail(mailData)
    console.log("Mail sent successfully",sentMail)
} catch (error) {
  console.log("Mail error: " , error)  
}
    }

   module.exports ={ sendMail }