const express = require('express');

const app = express()
const port = 3000;

app.get('/:city', (req, res) => {

  const city = req.params.city;

  const percentage = Math.floor(Math.random() * (100 - 1)) + 1;

  res.send(`the predicted awesomeness in ${city} is ${percentage}%`);
});

app.get('/', (req, res) => {
  res.send('try to access an actual city like "localhost/london"')
});

app.listen(port, () => console.log(`server listening on port ${port}`));
