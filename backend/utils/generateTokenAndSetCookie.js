const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
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
      Date.now() + process.env.JWT_EXPIRE_COOKIE * 24 * 60 * 60 * 1000,
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

module.exports = generateTokenAndSetCookie;
