const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

let AuthorSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Wrong email!',
    },
  },
  bio: {
    type: String,
  },
  avatarURL: {
    type: String,
  },

  sessionToken: [{
    token: String,
  }, ],
});

AuthorSchema.pre('save', function (next) {
  let author = this;
  if (author.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(author.password, salt, (err, hash) => {
        author.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

let Author = mongoose.model('Author', AuthorSchema);

module.exports = Author;