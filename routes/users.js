const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator/check')

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

var User = require('../models/User')

// Get  Homepage
router.get('/register', (req, res) => {
  res.render('register')
})

// Get  Homepage
router.get('/login', (req, res) => {
  res.render('login')
})

// Register User
router.post('/register', (req, res) => {

  // Validation
  req.check('name', 'Name is required').notEmpty()
  req.check('email', 'Email is required').notEmpty()
  req.check('email', 'Invalid email address').isEmail()
  req.check('username', 'username is required').notEmpty();
  req.check('password', 'Password is required').notEmpty()
  req.check('password', 'Password must be greater than 4 characters').isLength({min: 4})
  req.check('password', 'Passwords do not match').equals(req.body.password2)

  const form = {
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    password2: req.body.password2
  }

  const errors = req.validationErrors();

  if(errors){
    res.render('register', {
      errors: errors,
      form: form
    });
  } else {
    let newUser = new User({
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    });

    // Call CreateUser function thats in the model
    User.createUser(newUser, (err, user) => {
      if(err) throw err;
      console.log(user);
    })
    req.flash('success_msg', 'you are registered. you can now login')
    res.redirect('/users/login')
  }
})

// LocalStrategy
passport.use(new LocalStrategy((username, password, done) => {
    User.getUserByUsername(username, (err, user) => {
      if(err) throw err;
      if(!user) {
        return done(null, false, {message: 'Unknown User'})
      }

      User.comparePassword(password, user.password, (err, isMatch) => {
        if(err) throw err;
        if(isMatch) {
          return done(null, user)
        } else {
          return done(null, false, {message: 'Invalid password'})
        }
      })
    })
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.getUserById(id, (err, user) => {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true }),
  function(req, res) {
    res.redirect('/')
});

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', 'You are logged out')

  res.redirect('/users/login');
})

module.exports = router;
