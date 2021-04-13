const mongoose = require('mongoose');

let CommentSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Author',
  },
  publication: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Publication',
  },
});

let Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
