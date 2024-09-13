/********************************************************/
/***********  Import external modules ******************/
const express = require('express');
const router = express.Router();

/********************************************************/
/***********  Import internal modules ******************/
const clientController = require('../controllers/clients.controller');
const protect = require('../middlewares/verifyToken');
/******************************************************/
/***********  API ROUTES FOR CLIENTS ******************/

/*******************************************************/
//********************EXPORT MODULES *******************/
module.exports = router;
