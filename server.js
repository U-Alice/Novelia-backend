const express = require('express');
const app = express();
const { router } = require('./routes');
const path = require("path");
const crypto = require('crypto');
const methodOverride =  require('method-override');
const dotenv = require('dotenv');
dotenv.config()
const mongoose = require('mongoose')
const Grid = require('gridfs-stream')
const database = mongoose.connect(process.env.URL).then(()=>{
    console.log('connected to the database')
}).catch(()=>{
    console.log('not connected to the database')
})
// database.once('open', ()=>{
//     gfs = Grid(database.db, mongoose.mongo);
//     gfs.collection('uploads');
// })
router(app);
app.use(express.json());
app.set('view engine', 'ejs');
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended: true}));
app.set("views", path.join(__dirname, "views"));
app.get('/uploads', (req, res)=>{
    res.render('index');
})
app.listen(process.env.PORT, ()=>{
    console.log('server listening on port '+process.env.PORT);
});