const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema;

const uri = 'mongodb+srv://admin:Godfatherdon1~@my-mongo-cluster-7dgup.mongodb.net/node-login-app?retryWrites=true'
mongoose.connect(uri, {useNewUrlParser: true })
const db = mongoose.connection

// User Schema
const UserSchema = new Schema({
  username: {
    type: String,
    createIndexes: true
  },
  password: {
    type: String
  },
  email: {
    type: String
  },
  name: {
    type: String
  }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback) {
  bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
          // Store hash in your password DB.
          newUser.password = hash
          newUser.save(callback)
    });
  });
}

module.exports.getUserByUsername = function(username, callback) {
  let query = {username: username}
  User.findOne(query, callback)
}

module.exports.getUserById = function(id, callback) {
  User.findById(id, callback)
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  // Load hash from your password DB.
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    if(err) throw err;
    callback(null, isMatch)
  });
}
