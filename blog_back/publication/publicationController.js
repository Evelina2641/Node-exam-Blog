const Publication = require('./publicationModel');

let savePublication = async (req, res) => {
  let body = req.body;
  let publication = new Publication({
    title: body.title,
    content: body.content,
    author: req.author._id,
    publicationDate: new Date(),
    imageURL: body.imageURL,
  });

  try {
    let savedPublication = await publication.save();
    res.json(savedPublication);
  } catch (e) {
    res.status(401).json(e);
  }
};

let savePublicationPhoto = async (req, res) => {
  try {
    let file = await req.file;
    res.json(file.path);
  } catch (e) {
    res.status(400).json(e);
  }
};

let getAllPublications = async (req, res) => {
  try {
    let allPublications = await Publication.find({})
      .populate('author')
      .populate({
        path: 'comments',
        model: 'Comment',
        populate: {
          path: 'author',
          model: 'Author',
        },
      });
    res.json(allPublications);
  } catch (e) {
    res.status(401).json(e);
  }
};

let getAuthorPublications = async (req, res) => {
  try {
    let authorPublications = await Publication.find({
      author: req.author._id,
    });
    res.json(authorPublications);
  } catch (e) {
    res.status(401).json(e);
  }
};

let deletePublication = async (req, res) => {
  let publicationId = req.params.id;
  try {
    let deletedItem = await Publication.findOneAndDelete({
      _id: publicationId,
    });
    res.json(deletedItem);
  } catch (err) {
    res.status(404).json(err);
  }
};

let updatePublication = async (req, res) => {
  let publicationId = req.body._id;
  try {
    let updatedPublication = await Publication.findOneAndUpdate({
        _id: publicationId,
      },
      req.body
    );
    res.json(updatedPublication);
  } catch (err) {
    res.status(404).json(err);
  }
};

let saveClaps = async (req, res) => {
  let publicationId = req.params.id;
  try {
    let clapedPublication = await Publication.findOneAndUpdate({
      _id: publicationId,
    }, {
      $inc: {
        claps: 1,
      },
    }, {
      new: true,
    });
    res.json(clapedPublication.claps);
  } catch (err) {
    res.status(404).json(err);
  }
};

let getPublicationInfoById = async (req, res) => {
  let publicationId = req.params.id;
  try {
    let publication = await Publication.findOne({
        _id: publicationId,
      })
      .populate('author')
      .populate({
        path: 'comments',
        model: 'Comment',
        populate: {
          path: 'author',
          model: 'Author',
        },
      });
    res.json(publication);
  } catch (e) {
    res.status(400).json(e);
  }
};

module.exports = {
  savePublication,
  getAllPublications,
  getAuthorPublications,
  deletePublication,
  updatePublication,
  savePublicationPhoto,
  saveClaps,
  getPublicationInfoById,
};