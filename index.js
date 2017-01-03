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
    res.send('Tú no tienes que entrar aquí');
  }
});

app.post('/webhook', (req, res) => {
  const data = req.body;
  if (data.object === 'page') {
    data.entry.forEach((pageEntry) => {
      pageEntry.messaging.forEach((messagingEvent) => {
        if (messagingEvent.message) {
          receiveMessage(messagingEvent);
        }
      });
    });
    res.sendStatus(200);
  }
});

function receiveMessage(event) {
  const senderID = event.sender.id;
  const messageText = event.message.text;
  evaluateMessage(senderID, messageText);
}

function evaluateMessage(recipientId, message) {
  let finalMessage = '';
  if (isContain(message, 'ayuda')) {
    finalMessage = 'Por el momento no te puedo ayudar';
  } else {
    finalMessage = 'solo se repetir las cosas: ' + message;
  }
  sendMessageText(recipientId, finalMessage);
}

function sendMessageText(recipientId, message) {
  const messageData = {
    recipient: {id: recipientId},
    message: {text: message}
  };
  callSendAPI(messageData);
}

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token: APP_TOKEN},
    method: 'POST',
    json: messageData
  }, (err, res, data) => {
    if (err) console.log('No es posible enviar el mensaje');
    else {
      console.log('El mensaje fue enviado');
    }
  });
}

function isContain(sentence, word) {
  return sentence.indexOf(word) > -1;
}
