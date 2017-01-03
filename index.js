const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const logger = require('morgan');

const app = express();
const port = process.env.PORT || '3000';

app.use(logger('dev'));
app.use(bodyParser.json());

app.listen(port, () => {
  console.log('El servidor se encuentre en el puerto ' + port);
});

app.get('/', (req, res) => {
  res.send('Bienvenido al taller');
});
