/********************************************************/
/***********  Import external modules ******************/
const express = require('express');
const router = express.Router();
const crypto = require('crypto');

/********************************************************/
/***********  Import internal modules ******************/
const authController = require('../controllers/auth.controllers');
const protect = require('../middlewares/verifyToken');

/******************************************************/
/***********  API ROUTES FOR AUTH ******************/

//Create New user
router.route('/singup').post(authController.singup);

//Verify User email
router
  .route('/verify-email')
  .post(protect.verifyToken, authController.verifyEmail);

//Login User
router.route('/login').post(authController.login);

//Forget Passsword
router.route('/forgot-password').post(authController.forgetPass);

//Reset Password
router.route('/Reset-password/:token').post(authController.resetPass);

//Update Password
router
  .route('/update-password')
  .post(protect.verifyToken, protect.isActivate, authController.updatePass);

//Loggout
router.route('/Logout').post(authController.logout);

//Get access
router
  .route('/user')
  .get(protect.verifyToken, protect.isActivate, authController.user);

/*******************************************************/
//********************EXPORT MODULES *******************/
module.exports = router;
