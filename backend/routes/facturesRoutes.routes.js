/********************************************************/
/***********  Import external modules ******************/
const express = require('express');
const router = express.Router();

/********************************************************/
/***********  Import internal modules ******************/
const factureController = require('../controllers/factures.controller');
const protect = require('../middlewares/verifyToken');
/******************************************************/
/***********  API ROUTES FOR CLIENTS ******************/

//CREATION DE FACTURE
router
  .route('/newfacture/:id')
  .post(protect.verifyToken, factureController.newFacture);

//GET ALL FACTURE
router
  .route('/all')
  .get(protect.verifyToken, protect.isActivate, factureController.allFacture);

//GET ONE FACTURE
router
  .route('/:id')
  .get(protect.verifyToken, protect.isActivate, factureController.oneFacture);

//GET ALL FACTURE CLIENT
router
  .route('/client/:id') //Ici id represente l'id du client
  .get(
    protect.verifyToken,
    protect.isActivate,
    factureController.allFactureClient,
  );

//UPDATE FACTURE
router
  .route('/update/:id')
  .patch(
    protect.verifyToken,
    protect.isActivate,
    factureController.updateFacture,
  );

//DELETE FACTURE
router
  .route('/delete/:id')
  .delete(
    protect.verifyToken,
    protect.isActivate,
    protect.isAdmin,
    factureController.delFature,
  );

/*******************************************************/
//********************EXPORT MODULES *******************/
module.exports = router;
