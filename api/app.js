  
const express = require("express");
const app = express();

const cors = require('cors');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//importing Routes
const businessRoute = require('../api/routes/business.routes');
//both edit profile and password changings in routes/changepassword.js
/* const editingsRoutes = require('./routes/changepassword');
const registerRoutes = require('./routes/userRegRoutes');

const walletRoutes = require('./routes/addingWallet'); */

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
const url =
"mongodb+srv://staice:staice2010@cluster1.jgugv.mongodb.net/monitoring?retryWrites=true&w=majority";
 
mongoose
  .connect(url, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true , useFindAndModify: false })
  .then(() => {
    console.log("connected.....");
  });


  app.use('/business', businessRoute);
  //app.use('/settings/changepassword', changepwdRoutes);
/*   app.use('/settings', editingsRoutes);
  app.use('/register',registerRoutes);
  app.use('/add/wallet',walletRoutes);
 */
module.exports = app;