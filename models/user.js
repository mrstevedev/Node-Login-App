const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const uri = 'mongodb+srv://admin:Godfatherdon1!@my-mongo-cluster-7dgup.mongodb.net/node-login-app?retryWrites=true'
mongoose.connect(uri)

const db = mongoose.connection;

// User Schema
const UserSchema = mongoose.Schema({
  username: {
    type: String,
    index: true
  }
})
