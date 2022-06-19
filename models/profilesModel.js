const mongoose = require('mongoose')
const profileSchema = mongoose.Schema({
    image: {
        type: String
    },
    userId:{
        type: String
    }
})
module.exports.Profile = mongoose.model('profile',profileSchema)