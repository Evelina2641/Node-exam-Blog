const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');
const cors = require('cors');

mongoose.connect('mongodb://localhost/my_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

app.use(bodyParser.json());

const corsOptions = {
  exposedHeaders: ['author-auth'],
};
app.use(cors(corsOptions));

app.use('/uploads', express.static('uploads'));

app.use('/blog', routes);

app.listen(3000);
