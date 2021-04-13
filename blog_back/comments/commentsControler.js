const Comment = require('./commentsModel');
const Publication = require('../publication/publicationModel');

let createComment = async (req, res) => {
  let body = req.body;
  let publicationId = req.params.id;
  let comment = new Comment({
    date: new Date(),
    comment: body.comment,
    author: req.author._id,
    publication: publicationId,
  });

  try {
    let savedComment = await comment.save();
    let commentID = comment._id;

    let publication = await Publication.findOneAndUpdate({
        _id: publicationId,
      }, {
        $push: {
          comments: commentID
        }
      }, {
        new: true,
      })
      .populate('author') //publikacijos autorius
      .populate({
        path: 'comments',
        model: 'Comment',
        populate: {
          path: 'author',
          model: 'Author',
        },
      }); // komentaro autorius


    res.json(publication);
    res.json(savedComment);
  } catch (e) {
    console.log(e);
    res.status(401).json(e);
  }
};

module.exports = {
  createComment,
};