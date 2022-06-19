const express = require('express');
const app = express();
const { router } = require('./routes');
const path = require("path");
const crypto = require('crypto');
const methodOverride =  require('method-override');
const dotenv = require('dotenv');
dotenv.config()
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const Grid = require('gridfs-stream')
const cors = require('cors')
const bodyParser = require('body-parser')
const fileupload = require('express-fileupload');
const database = mongoose.connect(process.env.URL).then(()=>{
    console.log('connected to the database')
}).catch(()=>{
    console.log('not connected to the database')
})
// database.once('open', ()=>{
//     gfs = Grid(database.db, mongoose.mongo);
//     gfs.collection('uploads');
// })
app.use(fileupload())
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())
router(app);
app.set('view engine', 'ejs');
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended: true}));
app.set("views", path.join(__dirname, "views"));
app.get('/uploads', (req, res)=>{
    res.render('index');
})
app.get('/login', (req, res)=>{
     res.render('login')
})
app.listen(process.env.PORT, ()=>{
    console.log('server listening on port '+process.env.PORT);
});