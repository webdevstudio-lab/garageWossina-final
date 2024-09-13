const jwt = require('jsonwebtoken');
const prisma = require('../config/prismaConfig');
const { promisify } = require('util'); // this pakacge is on nodeJs by default your don't need to install it

//VERIFICATION DU TOKENT
exports.verifyToken = async (req, res, next) => {
  try {
    // 1- Getting token and check of it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.MySuperCookie) {
      token = req.cookies.MySuperCookie;
    }

    if (!token) {
      return next(
        res.status(401).json({
          status: 'Fail',
          message: 'Your are not logged in! please log to get acces',
        }),
      );
    }

    // 2- Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3- Check if user still exists
    const currentUser = await prisma.user.findUnique({
      where: { userid: decoded.id },
    });
    if (!currentUser) {
      return next(
        res.status(401).json({
          status: 'Fail',
          message: 'The user bellong to the this token no longer exist.',
        }),
      );
    }

    // 4- Check if user changed password after the token was issued
    if (currentUser.passUpdateAt < decoded.iat) {
      return next(
        res.status(401).json({
          success: false,
          message: 'This User recently change his password please login again!',
        }),
      );
    }

    //GRANT ACCESS TO PROTECTD ROUTE
    req.user = currentUser;
    res.locals.user = currentUser;
  } catch (error) {
    // console.log(error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
  next();
};

//VERIFICATION DU COMPTE
exports.isActivate = async (req, res, next) => {
  const userAccount = req.user.isVerified;

  if (!userAccount) {
    return next(
      res.status(401).json({
        success: false,
        message: 'This account not yet activate',
      }),
    );
  }
  next();
};

//VERIFICATION ADMIN
exports.isAdmin = async (req, res, next) => {
  const userAdmin = req.user.role;
  if (userAdmin === 'user') {
    return next(
      res.status(401).json({
        success: false,
        message: "Vous n'etes pas autotisé a éffectuer cette action",
      }),
    );
  }
  next();
};
