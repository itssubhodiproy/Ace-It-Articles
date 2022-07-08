const express = require('express')
const router = express.Router()
const {checkNotAuthenticated} = require('../helpers/auth')
const passport = require('passport')

router.get('/', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})

router.post('/', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/articles',
    failureRedirect: '/login',
    failureFlash: true
}))

module.exports = router   