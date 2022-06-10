
const mongoose = require('mongoose');
const emailMongo = require('mongoose-type-email');
const joi = require('joi')
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken')
dotenv.config()
const userSchema = new mongoose.Schema({
       email:{
           type:String,
           required:true
       },
       userName: {
           type:String,
           minlength:1,
           maxlength:100,
           required: true
       },
       password:{
           type:String,
           minlength:8,
           maxlength:128,
           required:true
       },
       token:{
        type: String, 
        required: true
       }
});
userSchema.methods.generateToken = function(cb){
    var user = this;
    var token = jwt.sign(user._id.toHexString(),process.env.SECRET)
    user.token = token;
    user.save(function(err,user){
        if(err) return cb(err);
        return user;
    })
};
userSchema.statics.findByToken = function(token,cb){
    var user = this;
    jwt.verify(token,process.env.SECRET,function(err,decode){
        user.findOne({"_id":decode, "token":token},function(err,user){
            if(err) return cb(err)
            cb(null,user)
        })
    })
};

module.exports.User = mongoose.model('User',userSchema);

const validate = (user)=>{
const Schema = joi.object({
    userName:joi.string().required().label('userName'),
    email:joi.string().email().required().label('email'),
    password: joi().string().required().min(8).label("password"),
})
return Schema.validate(user)
}
module.exports.validate = validate