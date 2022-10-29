const express = require('express');
const path = require('path')
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express()
const port = process.env.PORT || 3000;
require("dotenv").config();

// for POST request
app.use(cookieParser('secret'))
app.use(session({
    secret: 'flash',
    saveUninitialized: true,
    resave: true,
    cookie: {
        maxAge: 60000
    }
}));
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use(express.static('public'))
app.use(flash());

// views
app.set('views', path.join('./views/'))
app.set('view engine', 'ejs')

// route
const routes = require('./routes/index')
app.use('/', routes)

app.listen(port, () => {
    console.log(`server is listening on ${port}`)
})