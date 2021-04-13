const Author = require('./authorModel');
const bcrypt = require('bcrypt');
const {
  response
} = require('express');
const jwt = require('jsonwebtoken');

let signUp = async (req, res) => {
  let author = new Author(req.body);
  try {
    let createdAuthor = await author.save();
    res.json(createdAuthor);
  } catch (e) {
    res.status(400).json(e);
  }
};

let login = async (req, res) => {
  try {
    let author = await Author.findOne({
      username: req.body.username,
    });
    if (!author) throw "User doesn't exist";
    let response = await bcrypt.compare(req.body.password, author.password);
    if (!response) throw 'Incorrect password';
    let token = await jwt
      .sign({
          _id: author._id.toHexString(),
        },
        'superDuperSecret'
      )
      .toString();
    author.sessionToken.push({
      token,
    });
    await author.save();
    res.header('author-auth', token).json(author);
  } catch (e) {
    res.status(401).json(e);
  }
};

let logout = async (req, res) => {
  let token = req.token;
  let author = req.author;

  try {
    await author.update({
      $pull: {
        sessionToken: {
          token,
        },
      },
    });
    res.json('logout');
  } catch (e) {
    res.status(400).json(e);
  }
};

let saveAuthorPhoto = async (req, res) => {
  let token = req.header('author-auth');
  try {
    let savedPhoto = await Author.findOneAndUpdate({
      'sessionToken.token': token,
    }, {
      avatarURL: req.file.path,
    }, {
      new: true,
    });
    res.json(savedPhoto);
  } catch (e) {
    res.status(400).json(e);
  }
};

let saveAuthorBio = async (req, res) => {
  let token = req.header('author-auth');
  try {
    let savedBio = await Author.findOneAndUpdate({
      'sessionToken.token': token,
    }, {
      bio: req.body.bio,
    }, {
      new: true,
    });
    res.json(savedBio);
  } catch (e) {
    res.status(400).json(e);
  }
};

let getAllAuthors = async (req, res) => {
  try {
    let allAuthors = await Author.find({});
    res.json(allAuthors);
  } catch (e) {
    res.status(401).json(e);
  }
};

let getAuthorInfo = async (req, res) => {
  let token = req.header('author-auth');
  try {
    let author = await Author.findOne({
      'sessionToken.token': token,
    });
    res.json({
      avatarURL: author.avatarURL,
      bio: author.bio,
      name: author.name,
      surname: author.surname,
      username: author.username,
    });
  } catch (e) {
    res.status(400).json(e);
  }
};

let updateAuthorInfo = async (req, res) => {
  let token = req.header('author-auth');
  try {
    let updatedAuthor = await Author.findOneAndUpdate({
        'sessionToken.token': token,
      },
      req.body
    );
    res.json(updatedAuthor);
  } catch (err) {
    res.status(400).json(err);
  }
};

let deleteAuthor = async (req, res) => {
  let token = req.header('author-auth');
  try {
    let deletedAuthor = await Author.findOneAndDelete({
      'sessionToken.token': token,
    });
    res.json(deletedAuthor);
  } catch (err) {
    res.status(404).json(err);
  }
};

module.exports = {
  signUp,
  login,
  logout,
  saveAuthorPhoto,
  getAllAuthors,
  getAuthorInfo,
  saveAuthorBio,
  updateAuthorInfo,
  deleteAuthor,
};