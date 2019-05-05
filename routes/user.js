const express = require("express")

const bcrypt = require("bcryptjs")
const flash = require("connect-flash")
const passport = require("passport")

require('../config/passport')(passport);
const router = express.Router()

// Import User model
const User = require("../models/User")

// Login page
router.get('/login', (req, res) => {
    res.render("login", {success_msg: res.locals.success_msg, error_msg: res.locals.error_msg})
})

// Login handler
router.post('/login', passport.authenticate('local', 
{   
    successRedirect: '/dashboard',
    failureRedirect: '/user/login',
    failureFlash: true })
)

router.get('/logout', (req, res, next) => {
    req.logOut()
    req.flash("success_msg", "You are logged out")
    res.redirect('/user/login')
})

// Register page
router.get('/register', (req, res) => {
    res.render("register")
})

// Register Hande
router.post('/register', (req, res) => {
    console.log(req.body)
    const {name, email, password, password2} = req.body
    let error = []

    // Check required fields
    if(!name || !email || !password || !password2){
        error.push({message: "Please fill in all fields"})
    }

    // Check passwords match
    if(password !== password2){
        req.flash("error_msg", "Passwords don't match")
    }

    // Check pass length
    if(password.length < 6){
        req.flash("error_msg", "The password should be at least 6 characters")
    }

    if(error.length > 0){
        console.log(error)
        res.render('register', {
            error,
            name,
            email
        })
    }else{
       // Validation passed
       User.findOne({"email": email})
        .then(user => {
            if(user){
                //User exist
                error.push({"message": "Email is already registered"})
                res.render('register', {
                    error,
                    name,
                    email
                })
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                })

                // Hash Password
                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err
                    
                    // Set password to hashed
                    newUser.password = hash
                    // Save user
                    newUser.save()
                        .then(user => {
                            req.flash("success_msg", "You have been successfuly registered in")
                            res.redirect('/user/login')
                        })
                        .catch(err => console.log(err))
                }))
            }
        })
    }
})

module.exports = router