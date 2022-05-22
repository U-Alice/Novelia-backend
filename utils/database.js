const dotenv = require('dotenv');
dotenv.config()
const mongoose = require('mongoose')

module.exports.database = () => {
    mongoose.connect(process.env.URL).then(() => {
        console.log('connected to the database');
    }).catch(err => console.log(err));
}

