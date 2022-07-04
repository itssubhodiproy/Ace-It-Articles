const express = require('express')
const router = express.Router()
const Users = require('../models/Users')
const { checkNotAuthenticated } = require('../helpers/auth')
const bcrypt = require('bcrypt')

router.get('/', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})

router.post('/', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = await Users.findOne({ username: req.body.username })
        if (user) return res.status(400).send("User Already Exists")
        await Users.create({
            name: req.body.name,
            username: req.body.username,
            password: hashedPassword,
            role: req.body.role
        })
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
})

module.exports = router