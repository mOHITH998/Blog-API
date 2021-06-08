const User = require('../models/userModel');
const asyncHandler = require('../utils/catchAsync');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.protect = asyncHandler(async (req, res, next) => {
  let verifyToken;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    verifyToken = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(verifyToken, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select('-password')
    next()
  }
})

//REGISTER NEW USER
exports.registerUser = asyncHandler(async (req, res) => {
  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(req.body.password, salt);

  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: hash,
  });

  //  Using jwt to authenticate user in more securely
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
  const user = await newUser.save();
  res.status(201).json({
    status: 'success',
    token,
    user,
  });
});

//LOGIN USER
exports.loginUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    email: req.body.email
  });
  const validated = await bcrypt.compare(req.body.password, user.password);
  if (!user && !validated) {
    return res.status(400).json('Wrong credentials!');
  }

  const {password, ...all} = user._doc;

  // to avoid showing password to the user
  res.status(200).json({
    status: 'success',
    all
  });
});
