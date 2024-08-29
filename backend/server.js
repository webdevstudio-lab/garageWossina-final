/**********************************************/
/***********  Import module ******************/
const app = require('./app');
const dotenv = require('dotenv');

/**********************************************/
/***********  Api Initialization ******************/
dotenv.config();

/**********************************************/
/***********  Database connexion ******************/

/**********************************************/
/***********  Runnig the server ******************/

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
