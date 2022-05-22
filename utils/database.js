const dotenv = require('dotenv');
dotenv.config()
const mongoose = require('mongoose')
const Grid = require('gridfs-stream')

const database = mongoose.connect(process.env.URL).then(() => {
    console.log('connected to the database');
}).catch(err => console.log(err));
database.once('open', ()=>{
    //initialize stream
    gfs = Grid(database.db, mongoose.mongo)
    gfs.collection('uploads', )
})
//create storage variable

