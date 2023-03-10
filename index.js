const app = require('express')()
const consign = require('consign')
const db = require('./config/db')
const mongoose = require('mongoose')

require('./config/mongo')

app.db = db
app.mongoose = mongoose

consign()
    .include('./config/passport.js')
    .then('./config/middlewares.js')
    .then('./api/validations.js')
    .then('./api')
    .then('./schedule')
    .then('./config/routs.js')
    .into(app)

app.listen(3000, () =>{
    console.log("Back-end executando");
})