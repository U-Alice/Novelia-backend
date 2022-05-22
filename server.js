const express = require('express');
const app = express();
const dotenv = require('dotenv');
const { router } = require('./routes');
const { database } = require('./utils/database');
const path = require("path");
const crypto = require('crypto');
const methodOverride =  require('method-override');

dotenv.config()
database();
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