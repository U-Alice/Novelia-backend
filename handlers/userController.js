const { db } = require("../utils/database");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { User } = require("../models/userModel");
const { Password } = require("../models/passworreset");
const { sendMail } = require("../utils/sendMail");
const QueryString = require("qs");
const redirectURI = "auth/google";

module.exports.register = (db) => {
  return async (req, res) => {
    const result = await User.findOne({ email: req.body.email });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    if (result) {
      return res.status(401).json({
        message: "Email already registered",
        status: "failed",
      });
    }

    try {
      const user = new User({
        email: req.body.email,
        password: hashedPassword,
        userName: req.body.userName,
      });
      await user.save();
      sendMail(req);
      // res.cookie("token", token, {
      //   httpOnly: true,
      //   secure: true,
      //   sameSite: "none",
      // });
      res.status(200).json({
        message: "User registered successfully",
        status: "success",
      });
    } catch (error) {
      res.status(401).json({
        message: error.message,
        status: "failed",
      });
    }
  };
};

module.exports.login = (db) => {
  return async (req, res) => {
    const user = await User.findOne({
      email: req.body.email,
    }).exec();
    console.log(user);
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(400).send({ message: "Invalid password" });
    } else {
      // const token = user.generateAuthToken();
      res.status(200).json({
        success: true,
        message: "Log in successfull",
        data: user,
        // token: token,
      });
    }
  };
};

module.exports.forgotPassword = (db) => {
  return async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(400).json({ message: "user not found" });
    }
    const OTP = otpGenerator.generate(6, {
      upperCaseAlphabets: true,
      specialChars: false,
    });
    let userDetails = await Password.findOne({ email: user.email });
    if (userDetails) {
      Password.findOneAndUpdate({ email: userDetails.email }, { OTP: OTP });
    } else {
      userDetails = new Password({
        email: user.email,
        OTP: OTP,
        User_id: user.id,
      });
      await userDetails.save();
    }

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "",
        pass: "",
      },
    });
    const mailOptions = {
      to: user.email,
      from: "umugwanezaalice22@gmail.com",
      subject: "password reset request",
      html: `
          <html>
         <h6> Hi ${user.firstName} </h6>\n
         <p> below is the verification code for your password reset request <br> This code is valid for 15 minutes</p>
          <h3>${OTP}</h3>
          </html>
          `,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      }
      console.log("sent" + info.response);
      res.send("email sent successfully");
    });
  };
};

module.exports.verifyEmail = (db) => {
  return async (req, res) => {
    const updatePassword = await Password.findOne({
      email: req.body.email,
      OTP: req.body.OTP,
    });
    if (!updatePassword) {
      res.status(401).send("Invalide OTP");
    }
    res.status(200).send("OTP validation successfull");
  };
};
module.exports.updatePassword = () => {
  return async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const userUpdate = await Password.findOne();
    const hashed = await bcrypt.hash(req.body.password, salt);
    User.findOneAndUpdate(
      { email: userUpdate.email },
      { password: hashed },
      () => {
        res.send("password updated successfully");
      }
    );
    Password.findOneAndRemove({ email: userUpdate.email }, () => {
      console.log("userUpdate removed");
    });
  };
};
function getGoogleAuthUrl() {
  const rootUrl = "https://accounts.google.com/o/oauth2/auth";
  const options = {
    redirect_uri: `${process.env.SERVER_ROOT_URI}/${redirectURI}`,
    client_id:
      "47405812488-77ctquhbs9kbokl64kj52g4m4tfjo6ia.apps.googleusercontent.com",
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };
  return `${rootUrl}?${QueryString.stringify(options)}`;
}

module.exports.oAuth = () => {
  return async (req, res) => {
    res.send(getGoogleAuthUrl());
  };
};
// const oauth2Client = new google.auth.OAuth2(
//   process.env.GOOGLE_CLIENT_ID,
//   PROCESS.env.GOOGLE_CLIENT_SECRET,
//   "http://localhost:3000/auth/google"
// )
//
module.exports.getTokens = (code ) =>{
  const url = "https://oauth2.googleapis.com/token";
  const values = {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: redirectURI,
    grant_type: "authorization_code",
  };

  return axios
    .post(url, QueryString.stringify(values), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      throw new Error(error.message);
    });
}
