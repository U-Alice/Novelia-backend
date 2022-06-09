const nodemailer = require('nodemailer')

module.exports.sendMail = (req)=>{
    const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    auth: {
      user: "hallcoder25@outlook.com",
      pass: "!!!?!?123Abana",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  const options = {
    from: "hallcoder25@outlook.com",
    to: req.body.email,
    subject: "VersusBet register activity",
    text: `We are thrilled to have you on our platform ${req.body.firstName},
                click here to login "https://versusbet.vercel.app/login"`,
  };
  transporter.sendMail(options, (err, info) => {
    if (err) {
      console.log(err.message);
      return;
    }
    console.log("Sent" + info.response);
  });
}