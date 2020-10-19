const nodemailer = require('nodemailer')
const response = {
  sendEmail: (params, email) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "hacker0001223@gmail.com",
        pass: "ammarpedia123",
      },
    });
    const link = `http://localhost:3000/api/login?verif=${params}`;
    var mailOptions = {
      from: "as@gmail.com",
      to: email,
      subject: "Sending Email using Nodejs",
      html:
        "Hello,<br> <h2>Please Click on the link to verify your email.</h2><br><a href=" +
        link +
        ">Click here to verify</a>",
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) throw err;
      console.log("Email sent: " + info.response);
    });
  },
};

module.exports = response;
