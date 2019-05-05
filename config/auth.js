module.exports =  {
    ensureAuthenticated: (req, res, next) => {
        if(req.isAuthenticated()) {
            return next()
        }
        req.flash('error_msg', "Please log in to access this section")
        res.redirect('/user/login')
    }
}