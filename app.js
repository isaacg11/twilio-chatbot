let express = require('express');
let bodyParser = require('body-parser');
let app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.end();
})

app.post('/inbound', (req, res) => {
  console.log(req.body);
  res.send(req.body);
})

app.listen(3000, () => {
  console.log('server connected');
})
