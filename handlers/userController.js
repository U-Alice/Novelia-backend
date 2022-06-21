const { db } = require("../utils/database");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { User } = require("../models/userModel");
const { Password } = require("../models/passworreset");
const { sendMail } = require("../utils/sendMail");
const QueryString = require("qs");
const redirectURI = "auth/google";
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "daso1btiz",
  api_key: "468557256968463",
  api_secret: "3S13jGO6WJPZ6-ojNFRUZmeshaY",
  secure: true,
});
const axios = require("axios");
const { Profile } = require("../models/profilesModel");

async function newUser(email, password, username) {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const result = await User.findOne({
    $or: [{ email: email, userName: username }],
  });
  if (result) {
    const message = {
      message: "Email or username is already registered",
      status: "Failed",
      statusCode: 500,
    };
    return message;
  }
  const user = new User({
    email: email,
    password: hashedPassword,
    userName: username,
  });
  user.generateToken();
  await user.save((err, doc) => {
    if (err) console.dir(err);
    console.log(doc);
  });
  const message = {
    message: "User registration successfull",
    status: "success",
    statusCode: 200,
  };
  return message;
}




module.exports.getImage = ()=>{
  return async (req,res)=>{
   const foundProfile = await Profile.findOne({userId:req.user});
   if(foundProfile){
    res.json({profile:foundProfile});
   }else{
    res.json({profile:null, message: "Failed to retrieve profile"});
   }
  }
}



module.exports.uploadProfile = () => {
  return async (req, res) => {
    try {
      const file = req.body;
      console.log(file);
      cloudinary.uploader.upload(file.data, function (error, result) {
        if (error) {
          console.log(error)
        }
      });
      const user = await User.findOne({ _id: req.user });
      const profile = await Profile.findOne({ userId: user._id });
      if (profile) {
        await Profile.findOneAndUpdate(
          { userId: user._id },
          { image: req.body.data }
        );
      } else {
        const newProfile = new Profile({
          userId: user._id,
          image: req.body.image,
        });
        await newProfile.save((err, doc) => {
          res.json({ profile: doc, success: true });
        });
      }
    } catch (err) {
      console.log(err);
      res.json({ success: false, message: err });
    }
  };
};



module.exports.register = (db) => {
  return async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.userName;
    const response = await newUser(email, password, username);
    return res
      .status(response.statusCode)
      .json({ message: response.message, success: response.status });
  };
};



module.exports.getBooks = () => {
  return async (req, res) => {
    const availableBooks = await Book.find();
    res.json({ books: availableBooks }).status(400);
  };
};



module.exports.login = (db) => {
  return async (req, res) => {
    const user = await User.findOne({
      email: req.body.email,
    }).exec();
    console.log(user);
    if (!user) {
      return res.send("Invalid user credentials");
    }
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(400).json({ message: "Invalid password" });
    } else {
      const token = user.generateToken();
      const profile = await Profile.findOne({ userId: user._id });
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      return res.status(200).json({
        success: true,
        message: "Log in successfull",
        data: user,
        token: token,
        profile: profile,
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
    res.redirect(getGoogleAuthUrl());
  };
};
module.exports.getGoogleUser = () => {
  return async (req, res) => {
    const code = req.query.code;
    let tokens;
    try {
      const response = await getTokens({ code });
      tokens = response;
    } catch (e) {
      console.log(e);
      return res.json({ message: "Failed to make the request" });
    }

    const googleUser = await axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokens.id_token}`,
          },
        }
      )
      .then((res) => res.data)
      .catch((error) => {
        throw new Error(error.message);
      });
    await newUser(googleUser.email, googleUser.given_name, googleUser.id);
    const response = await newUser(
      googleUser.email,
      googleUser.id,
      googleUser.given_name
    );
    return res
      .status(response.statusCode)
      .json({ message: response.message, success: response.status });
  };
};

function getTokens({ code }) {
  const url = "https://oauth2.googleapis.com/token";
  const values = {
    code: code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: "http://localhost:4001/auth/google",
    grant_type: "authorization_code",
  };
  return axios
    .post(url, values, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log(error.response.data);
      throw new Error(error);
    });
}

module.exports.logout = () => {
  return async (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, doc) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
      });
    });
  };
};
