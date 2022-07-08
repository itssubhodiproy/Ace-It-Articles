const express = require('express');
const { checkNotAuthenticated } = require('../helpers/auth')
const router = express.Router()

router.get('/', checkNotAuthenticated, (req, res) => {
    res.render("landingPage");
});

module.exports = router   