const jwt = require('jsonwebtoken');
const Author = require('./authorModel');

let authenticate = async (req, res, next) => {
  let token = req.header('author-auth');
  try {
    let decoded = await jwt.verify(token, 'superDuperSecret');
    let author = await Author.findOne({
      _id: decoded._id,
      'sessionToken.token': token,
    });
    if (!author) throw 'Authentication failed';
    req.author = author;
    req.token = token;
    next();
  } catch (e) {
    e = e.message == 'jwt malformed' ? 'Wrong session token' : e;
    res.status(401).json(e);
  }
};

module.exports = authenticate;