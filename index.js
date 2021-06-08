const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
require('colour');
const morgan = require('morgan');
const postRouter = require('./routes/postRouter');
const authRouter = require('./routes/authRouter');
const userRouter = require('./routes/userRouter');
const multer = require('multer');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

dotenv.config();

app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

// todo Multer
const fileStorage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, 'img');
  },
  filename: (req, res, cb) => {
    cb(null, 'helloImg.jpeg');
  },
});
const fileUpload = multer({ storage: fileStorage });
app.post('/api/v3/upload', fileUpload.single('file'), (req, res) => {
  res.status(200).json('File has been uploaded');
});

app.use('/api/v3/posts', postRouter);
app.use('/api/v3/users', authRouter, userRouter);

const PORT = process.env.PORT || 4000;

//* connect to our database
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`server running on PORT: ${PORT}`.blue))
  )
  .catch((error) => console.log(error.message));
