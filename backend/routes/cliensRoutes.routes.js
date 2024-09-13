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

//Create New  client
router.route('/create').post(protect.verifyToken, clientController.newClient);

//Get on client
router
  .route('/getone/:id')
  .get(protect.verifyToken, protect.isActivate, clientController.getClient);

//Get alll client
router
  .route('/getall')
  .get(protect.verifyToken, protect.isActivate, clientController.getAllClient);

//Update client
router
  .route('/update/:id')
  .patch(
    protect.verifyToken,
    protect.isActivate,
    clientController.updateClient,
  );

//Get alll client
router
  .route('/delete/:id')
  .delete(
    protect.verifyToken,
    protect.isActivate,
    protect.isAdmin,
    clientController.deleteClient,
  );

/*******************************************************/
//********************EXPORT MODULES *******************/
module.exports = router;
