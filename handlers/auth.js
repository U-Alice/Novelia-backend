const jwt = require("jsonwebtoken");
module.exports.auth = ()=>{
  return async (req, res, next) => {
    const token = split(req.headers.authorization)[1];
    if(!token) {
      return res.status(403).json({ message: "User not authenticated" });
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    }catch(err){
        return res.status(403).json({ message: "Invalid token" });
    }
  }
}
