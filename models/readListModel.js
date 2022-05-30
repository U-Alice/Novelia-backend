const mongoose = require('mongoose');
const listSchema = mongoose.Schema({
    user_id : {
        type: String, 
        required: true
    }, 
    bookDetails: {
    type: Array, 
    required: true
    }, 
    count: {
        type: Number, 
        default: 1
    }
})
module.exports.List = mongoose.model('List',listSchema);
