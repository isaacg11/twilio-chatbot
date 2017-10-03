const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const twilio = require('twilio');
const accountSid = 'ACd8e8c7de910dffeb53cb2392df840932';
const authToken = '939af02287fe8f073d41d6af29eb07ed';
const client = new twilio(accountSid, authToken);

mongoose.connect('mongodb://isaac:123@ds161574.mlab.com:61574/codercamps-db', { useMongoClient: true, promiseLibrary: global.Promise });
let MessageSchema = new mongoose.Schema({
  groupName: String,
  phoneNumber: String,
  totalAdults: String,
  totalKids: String
})

let Message = mongoose.model('Message', MessageSchema);

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.end();
})

app.post('/inbound', (req, res) => {
  let from = req.body.From;
  let to = req.body.To;
  let body = req.body.Body;

  Message.find({phoneNumber: from}, (err, message) => {
    console.log(message);
    if(message.length !== 0) {
      if(!message[0].groupName && !message[0].totalAdults && !message[0].totalKids) {
        Message.findByIdAndUpdate(message[0]._id, {"$set" : {"groupName" : body}}, { "new": true, "upsert": true }, () => {
          client.messages.create({
            body: 'How many adults are in your group?',
            to: `${from}`,
            from: `${to}`
          })
          res.end();
        })
      } else if(!message[0].totalAdults && !message[0].totalKids) {
        Message.findByIdAndUpdate(message[0]._id, {"$set" : {"totalAdults" : body}}, { "new": true, "upsert": true }, () => {
          client.messages.create({
            body: 'How many kids are in your group?',
            to: `${from}`,
            from: `${to}`
          })
          res.end();
        })
      } else if(!message[0].totalKids) {
        Message.findByIdAndUpdate(message[0]._id, {"$set" : {"totalKids" : body}}, { "new": true, "upsert": true }, () => {
          client.messages.create({
            body: 'Okay, you are all set! Your spot has been reserved. Thank you!',
            to: `${from}`,
            from: `${to}`
          })
          res.end();
        })
      }
    } else {
      if(body === 'RSVP') {
        let newMessage = new Message();
        newMessage.phoneNumber = from;
        newMessage.save(() => {
          client.messages.create({
            body: 'Hey there! The Johnsons are really glad you are planning to attend their special day! What is the name of your group?',
            to: `${from}`,
            from: `${to}`
          })

          res.end();
        })
      }
    }
  })
})

app.listen(3000, () => {
  console.log('server connected');
})
