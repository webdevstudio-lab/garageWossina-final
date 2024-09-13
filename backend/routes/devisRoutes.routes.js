/********************************************************/
/***********  Import external modules ******************/
const express = require('express');
const router = express.Router();

/********************************************************/
/***********  Import internal modules ******************/

const protect = require('../middlewares/verifyToken');
const devisController = require('../controllers/devis.controller');

/******************************************************/
/***********  API ROUTES FOR CLIENTS ******************/

//Create New devis
router
  .route('/:id/new-devis')
  .post(protect.verifyToken, devisController.newDevis);

//Get all devis
router.route('/all').get(protect.verifyToken, devisController.getAllDevis);

//Get one devis
router.route('/:id').get(protect.verifyToken, devisController.getOneDevis);

//Get all devis client
router
  .route('/client/:id')
  .get(protect.verifyToken, devisController.getAllDevisClient);
//Update devis
router
  .route('/update/:id')
  .patch(protect.verifyToken, devisController.updateDevis);

//Delete on devis
router
  .route('/delete/:id')
  .delete(protect.verifyToken, protect.isAdmin, devisController.deleteDevis);

/*******************************************************/
//********************EXPORT MODULES *******************/
module.exports = router;
