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
  } else if (isContain(message, 'gato')) {
    sendMessageImage(recipientId);
  } else if (isContain(message, 'clima')) {
    getWeather(temperature => {
      message = getMessageWeather(temperature);
      sendMessageText(recipientId, message);
    });
  } else if (isContain(message, 'info')) {
    sendMessageTemplate(recipientId);
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

function sendMessageImage(recipientId) {
  // API imgur para imagens dinamicas
  const messageData = {
    recipient: {id: recipientId},
    message: {
      attachment: {
        type: 'image',
        payload: {url: 'http://i.imgur.com/SOFXhd6.jpg'}
      }
    }
  };
  callSendAPI(messageData);
}

function sendMessageTemplate(recipientId) {
  const messageData = {
    recipient: {id: recipientId},
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [elementTemplate()]
        }
      }
    }
  };
  callSendAPI(messageData);
}

function elementTemplate() {
  return {
    title: 'Sebastian Duque Restrepo',
    subtitle: 'Estudiante de Ingenieria de Sistemas y Computación',
    item_url: 'https://www.facebook.com/jointDeveloper/?fref=ts',
    image_url: 'http://i.imgur.com/SOFXhd6.jpg',
    buttons: [buttonTemplate()]
  };
}

function buttonTemplate() {
  return {
    type: 'web_url',
    url: 'https://www.facebook.com/jointDeveloper/?fref=ts',
    title: 'jointDeveloper'
  };
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

function getMessageWeather(temperature) {
  if (temperature > 30) {
    return "Nos encontramos a " + temperature + "°C y demasiado calor, te recomiendo que no salgas";
  } else {
    return "Nos encontramos a " + temperature + "°C es un bonito día para salir";
  }
}

function getWeather(callback) {
  request('http://api.geonames.org/findNearByWeatherJSON?lat=16.750000&lng=-93.11669&username=eduardo_gpg',
    (err, res, data) => {
      if (!err) {
        res = JSON.parse(data);
        const temperature = res.weatherObservation.temperature;
        callback(temperature);
      }
    }
  );
}

function isContain(sentence, word) {
  return sentence.indexOf(word) > -1;
}
