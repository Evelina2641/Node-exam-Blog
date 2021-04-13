const mongoose = require('mongoose');

let PublicationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
  },
  publicationDate: {
    type: Date,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
  claps: {
    type: Number,
    default: 0,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Author',
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
});

let Publication = mongoose.model('Publication', PublicationSchema);

module.exports = Publication;
