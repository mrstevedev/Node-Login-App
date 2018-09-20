const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator/check');

const User = require('../models/user')

// Get  Homepage
router.get('/register', (req, res) => {
  res.render('register')
})

// Get  Homepage
router.get('/login', (req, res) => {
  res.render('login')
})

// Register User
router.post('/register', (req, res, next) => {

  // Validation
  req.check('name', 'Name is required').notEmpty()
  req.check('email', 'Email is required').notEmpty()
  req.check('email', 'Invalid email address').isEmail()
  req.check('username', 'username is required').notEmpty();
  req.check('password', 'Password is required').notEmpty()
  req.check('password', 'Password must be greater than 4 characters').isLength({min: 4})
  req.check('password', 'Passwords do not match').equals(req.body.password2)

  const body = req.body;

  const form = {
    name: body.name,
    email: body.email,
    username: body.username,
    password: body.password,
    password2: body.password2
  }

  const errors = req.validationErrors()
  if(errors){
    res.render('register', {
      errors: errors,
      form: form
    })
  } else {
    const newUser = new User({
      name: name,
      email: email,
      username:username,
      password: password
    })
    // Call CreateUser function thats in the model
    User.createUser(newUser, (err, user) => {
      if(err) throw err;
      console.log(user);
    })
    req.flash('success_msg', 'you are registered. you can now login')
    res.redirect('/users/login')
  }
})

module.exports = router
