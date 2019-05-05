const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require("mongoose")
const session = require("express-session")
const flash = require("connect-flash")
const passport = require('passport');

const app = express()

// DB Config
const db = require("./config/keys").MongoURI

// Passport config
require('./config/passport')(passport);

// Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true})
    .then(() => console.log("MongoDB connected ..."))
    .catch(err => console.log(err))

// EJS
app.use(expressLayouts)
app.set("view engine", "ejs")

// Bodyparser
app.use(express.urlencoded({extended: false}))

// Express Session
app.use(session({
    secret: 'secret things',
    resave: false,
    saveUninitialized: true,
}))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash())

// Gloval Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash("error")
    next()
})

// Routes
app.use('/', require("./routes/index"))
app.use('/user', require("./routes/user"))

app.listen(8080, console.log("Server listening on port 8080"))