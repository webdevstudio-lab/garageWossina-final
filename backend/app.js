/**********************************************/
/***********  NodeJs module ******************/
const path = require('path');

/**********************************************/
/***********  NodeJs module ******************/
const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors');

/**********************************************/
/***********  Import internal modules ******************/
const authRoutes = require('./routes/authRoutes.routes');
const clientRoutes = require('./routes/cliensRoutes.routes');
const devisRoutes = require('./routes/devisRoutes.routes');
const devisItemsRoutes = require('./routes/devisItems.routes');
const facturesRoutes = require('./routes/facturesRoutes.routes');
const facturesItemsRoutes = require('./routes/facturesItemsRoutes.routes');

/**********************************************/
/***********  Api Initialization ******************/
dotenv.config();
const app = express();

app.use(express.json({ limit: '20KB' }));
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.urlencoded({ extended: true }));

/**********************************************/
/**************  API ROUTES     ******************/

app.get('/', (req, res) => {
  res.status(201).json({
    status: 'Success',
    messages: 'Hello form the server!!!',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/devis', devisRoutes);
app.use('/api/facture', facturesRoutes);
app.use('/api/devis/items', devisItemsRoutes);
app.use('/api/factures/items', facturesItemsRoutes);

module.exports = app;
