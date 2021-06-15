const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = await User.findById(decoded._id);
    next();
  } else {
    res.status(401).json('Not authorized');
  }
});

exports.admin = catchAsync(async (req, res, next) => {
  req.user && req.user.isAdmin
    ? next()
    : res.status(401).json('Not authorized, only admin can access');
});
