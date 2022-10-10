// Enternal Files and Modules:
const express = require('express')
const mongoose = require('mongoose')
const Article = require('./models/article')
const bodyParser = require('body-parser')
const app = express()
require('dotenv').config()
const PORT = process.env.PORT
const MONGO_URI = process.env.MONGO_URI
//for login and authentication
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const { initialize, checkAuthenticated, checkNotAuthenticated } = require('./helpers/auth')
app.use(bodyParser.urlencoded({ limit: '4mb', extended: false }))

initialize(passport)

app.use(flash())
app.use(session({ secret: "SecretKey", resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log("error connecting to MongoDB:", err))


app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }))

const registerRoutes = require('./routes/register')
app.use('/register', registerRoutes)

const loginRoutes = require('./routes/login')
app.use('/login', loginRoutes)

const logoutRoutes = require('./routes/logout')
app.use('/logout', logoutRoutes)

const articleRoutes = require('./routes/articles')
app.use('/articles', articleRoutes)

const landingPageRoutes = require('./routes/landingPage')
app.use('/landingPage', landingPageRoutes)

app.get('/', checkNotAuthenticated, (req, res) => { res.redirect('/landingPage') })

app.listen(PORT, () => console.log(`server started at port ${PORT}`))

