const express = require('express')
const router = express.Router()
const Users = require('../models/Users')
const { checkNotAuthenticated } = require('../helpers/auth')
const bcrypt = require('bcrypt')
var generateUniqueSeed = require("generate-unique-id")

router.get('/', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})

router.post('/', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = await Users.findOne({ username: req.body.username })
        if (user) return res.status(400).send("User Already Exists")
        const seed = generateUniqueSeed();
        const userImageRandom = `https://avatars.dicebear.com/api/bottts/:${seed}.svg`
        await Users.create({
            name: req.body.name,
            username: req.body.username,
            password: hashedPassword,
            role: 'user',
            userImage: userImageRandom
        })
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
})

module.exports = router