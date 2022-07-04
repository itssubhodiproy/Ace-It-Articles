const express = require('express');
const { checkAuthenticated } = require('../helpers/auth');
const router = express.Router()



router.get('/', checkAuthenticated, function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/login');
    });
});

module.exports = router   