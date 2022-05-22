const express = require('express');
const app = express();
const dotenv = require('dotenv');
const { router } = require('./routes');
const { database } = require('./utils/database');
dotenv.config()
database()
router(app);
app.listen(process.env.PORT, ()=>{
    console.log('server listening on port '+process.env.PORT);
});