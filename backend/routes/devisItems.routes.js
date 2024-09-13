/********************************************************/
/***********  Import external modules ******************/
const express = require('express');
const router = express.Router();

/********************************************************/
/***********  Import internal modules ******************/
const devisItemsController = require('../controllers/devisItems.controller');
const protect = require('../middlewares/verifyToken');

/******************************************************/
/***********  API ROUTES FOR CLIENTS ******************/

//Ajouter un article
router
  .route('/:id')
  .post(
    protect.verifyToken,
    protect.isActivate,
    devisItemsController.addDevisItem,
  );

//Update devisitems
router
  .route('/update/:id')
  .patch(
    protect.verifyToken,
    protect.isActivate,
    devisItemsController.updateDevisItem,
  );

//delete devisItems
router
  .route('/delete/:id')
  .delete(
    protect.verifyToken,
    protect.isActivate,
    devisItemsController.deleteDevisItem,
  );
//Delete all DevisItems
router
  .route('/deleteall/:id')
  .delete(
    protect.verifyToken,
    protect.isActivate,
    devisItemsController.deleteAllDevisItem,
  );
/*******************************************************/
//********************EXPORT MODULES *******************/
module.exports = router;
