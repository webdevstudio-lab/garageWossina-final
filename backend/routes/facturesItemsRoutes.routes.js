/********************************************************/
/***********  Import external modules ******************/
const express = require('express');
const router = express.Router();

/********************************************************/
/***********  Import internal modules ******************/
const factureItemsController = require('../controllers/facturesItems.controller');
const protect = require('../middlewares/verifyToken');

/******************************************************/
/***********  API ROUTES FOR CLIENTS ******************/

//Ajouter un article
router
  .route('/:id')
  .post(
    protect.verifyToken,
    protect.isActivate,
    factureItemsController.addFactureItem,
  );

//Update devisitems
router
  .route('/update/:id')
  .patch(
    protect.verifyToken,
    protect.isActivate,
    factureItemsController.updateFactureItem,
  );

//delete devisItems
router
  .route('/delete/:id')
  .delete(
    protect.verifyToken,
    protect.isActivate,
    factureItemsController.deleteFactureItem,
  );
//Delete all DevisItems
router
  .route('/deleteall/:id')
  .delete(
    protect.verifyToken,
    protect.isActivate,
    factureItemsController.deleteAllFactureItem,
  );
/*******************************************************/
//********************EXPORT MODULES *******************/
module.exports = router;
