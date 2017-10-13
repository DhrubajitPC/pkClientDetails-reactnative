const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// Connect to Mongoose
mongoose.connect('mongodb://localhost/server', { useMongoClient: true });
const db = mongoose.connection;

app.use(bodyParser.json());

const ClientDetails = require('./models/clientDetails');

app.get('/', (req, res) => {
  res.send('welcome to the server');
});

app.post('/api/client-details', (req, res) => {
  const clientDetails = req.body;
  ClientDetails.create(clientDetails, (err, details) => {
    if (err) {
      res.status(404).send(err);
    }
    res.status(201).send(details);
  });
});

app.get('/api/client-details', (req, res) => {
  ClientDetails.find((err, data) => {
    if (err) {
      res.status(404).send(err);
    }
    res.status(200).send(data);
  });
});

app.listen(3000);
console.log('Running on port 3000 ... ');
