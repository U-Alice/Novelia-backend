
require("dotenv").config()
const jwt = require("jsonwebtoken");
module.exports.auth = ()=>{
  return async (req, res, next) => {
    const authorization = req.headers.authorization;
    const token = authorization.split(" ")[1];
    if(!token) {
       return res.status(403).json({ message: "User not authenticated" });
    }
    try{
        const decoded = jwt.verify(token, process.env.SECRET);
        req.user = decoded;
        return next()
    }catch(err){
        return res.status(403).json({ message: "Invalid token" });
    }
  }
}
