const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const logger = require('morgan');

const APP_TOKEN = 'EAAKPZBQemFxoBAJlRszvrl1TCAK3UlQUC5r7YsVMbkELzMltjrrrUd7ECHPxQTHzJP74BjgF7emJ0KrOQ0Hh1eg6zxabXTNZCf4cCZAwDaVrcZAuQMz8oKBEX4yb2iBRHebCiNcAuEJ2tmiZCiEdo6ZCqyUZB1ZCxXn7K6mNmLPpzgZDZD';

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

app.get('/webhook', (req, res) => {
  if (req.query['hub.verify_token'] === 'test_token_say_hello') {
    res.send(req.query['hub.challenge']);
  } else {
    res.send('Tú no tiene que entrar aquí');
  }
});
