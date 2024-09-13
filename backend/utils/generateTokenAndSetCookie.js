const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const prisma = require('../config/prismaConfig');
dotenv.config();

//GENERAT JWT TOKEN FOR AUTH

const generateTokenAndSetCookie = (user, statusCode, res, message) => {
  //Create a secrure Token your API
  const signToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE_IN,
    });
  };

  const token = signToken(user.userid, user.role);

  //Create cookie

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_EXPIRE_COOKIE * 60 * 60 * 1000,
    ),
    httpOnly: true,
    secrure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };

  res.cookie('MySuperCookie', token, cookieOptions);

  //displaying data and token without a user password
  res.status(statusCode).json({
    status: 'success',
    message: message,
    data: { ...user, password: undefined, role: undefined },
  });
};

const generateRefreshTokenAndSetCookie = async (user, res) => {
  //Create a secrure Token your API
  const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRE_IN,
    });
  };

  const token = signToken(user.userid);
  const hashToken = await bcrypt.hash(token, 10);

  //On Enregistre le refrehToken dans la base de donné
  await prisma.user.update({
    where: { userid: user.userid },
    data: {
      refreshToken: hashToken,
    },
  });

  //Create cookie

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_EXPIRE_COOKIE * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    secrure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };

  res.cookie('MyRefreshSuperCookie', token, cookieOptions);
};

module.exports = {
  generateTokenAndSetCookie,
  generateRefreshTokenAndSetCookie,
};
