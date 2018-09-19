const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator/check');

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
  req.check('email', 'Email is required').isEmpty()
  req.check('email', 'Invalid email address').isEmail()
  req.check('username', 'username is required').notEmpty();
  req.check('password', 'Passwords do not match').isLength({min: 4}).equals(req.confirmPassword)

  const body = req.body;
  const form = {
    name: body.name,
    // add more fields
  }

  const errors = req.validationErrors()
  if(errors){
    res.render('register', {
      errors: errors,
      form: form
    })
  } else {

  }
})

module.exports = router
