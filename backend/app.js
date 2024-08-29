/**********************************************/
/***********  NodeJs module ******************/
const path = require('path');

/**********************************************/
/***********  NodeJs module ******************/
const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

/**********************************************/
/***********  Import internal modules ******************/
const authRoutes = require('./routes/authRoutes.routes');

/**********************************************/
/***********  Api Initialization ******************/
dotenv.config();
const app = express();

app.use(express.json({ limit: '20KB' }));
app.use(cookieParser());
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

module.exports = app;
