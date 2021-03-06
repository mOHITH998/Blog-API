const User = require('../models/userModel');
const asyncHandler = require('../utils/catchAsync');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const genToken = require('../utils/generateToken');

//REGISTER NEW USER
exports.registerUser = asyncHandler(async (req, res) => {
  const userExist = await User.findOne({ email: req.body.email });

  if (userExist) res.status(400).json('user already exists');

  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(req.body.password, salt);

  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: hash,
    isAdmin: req.body.isAdmin,
  });

  //  Using jwt to authenticate user in more securely
  const user = await newUser.save();

  if (user) {
    res.status(201).json({
      status: 'success',
      user,
      token: genToken(user._id),
    });
  }
});

//LOGIN USER
exports.loginUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });
  const validated = await bcrypt.compare(req.body.password, user.password);
  if (!user && !validated) {
    return res.status(400).json('Wrong credentials!');
  }

  // to avoid showing password to the user
  const { password, ...all } = user._doc;

  res.status(200).json({
    status: 'success',
    all,
    token: genToken(user._id),
  });
});
