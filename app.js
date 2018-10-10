const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const expressValidator = require('express-validator')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const mongo = require('mongodb')
const mongoose = require('mongoose')
const uri = 'mongodb+srv://admin:Godfatherdon1!@my-mongo-cluster-7dgup.mongodb.net/node-login-app?retryWrites=true'
mongoose.connect(uri, { useNewUrlParser: true } )
const db = mongoose.connection

const routes = require('./routes/index')
const users = require('./routes/users')

// Init App
const app = express();



// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({'defaultLayout': 'layout'}))
app.set('view engine', 'handlebars')

// Body Parser Middleware

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(expressValidator())
app.use(cookieParser())


// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')))

// Express Session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}))

// Passport init
app.use(passport.initialize())
app.use(passport.session())

// Express Validator
app.use(express.json());

// Connect Flash
app.use(flash());

// Global consts
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  res.locals.user = req.user || null
  next();
});



app.use('/', routes)
app.use('/users', users)

// Set Port
const port = 5000
app.set('port', (process.env.PORT || port))
app.listen(app.get('port'), () => {
  console.log('Server started on port ' + app.get('port'))
})
