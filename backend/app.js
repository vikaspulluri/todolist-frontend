const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const appConfig = require('./config/config');

const app = express();
mongoose.connect(appConfig.connectionString, { autoIndex: false, useNewUrlParser: true })
        .then(() => {
          console.log('successfully connected to mongodb!!!');
        })
        .catch((err) => {
          console.dir(err);
          console.log('connection to mongodb failed!!!');
        });


//routes
const userRoutes = require('./routes/user-routes');

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers',"Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, PUT, DELETE, OPTIONS');
  next();
});

app.use('/api/user', userRoutes);

app.use((err, req, res, next) => {
  let status = err.status || 500;
  res.status(status).send(err);
})

app.use('*', (req, res, next) => {
  res.status(404).send({message: 'The route you are trying to access is not valid!!!'});
})



module.exports = app;
