let express = require('express');
let bodyParser = require('body-parser');
let app = express();
let twilio = require('twilio');
let accountSid = 'ACd8e8c7de910dffeb53cb2392df840932';
let authToken = '939af02287fe8f073d41d6af29eb07ed';
let client = new twilio(accountSid, authToken);

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.end();
})

app.post('/inbound', (req, res) => {  

  client.messages.create({
    body: 'Hello back',
    to: `${req.body.From}`,
    from: `${req.body.To}`
  })

  res.end();
})

app.listen(3000, () => {
  console.log('server connected');
})
