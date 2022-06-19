const jwt = require("jsonwebtoken");
module.exports.auth = ()=>{
  return async (req, res, next) => {
    const authorization = req.headers.authorization;
    console.log(req.headers)
    const token = authorization.split(" ")[1];
    console.log(token)
    if(token) {
       return res.status(403).json({ message: "User not authenticated" });
    }
    try{
        const decoded = jwt.verify(token, process.env.SECRET);
        req.user = decoded;
    }catch(err){
        return res.status(403).json({ message: "Invalid token" });
    }
  }
}
