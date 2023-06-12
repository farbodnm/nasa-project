const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');

const v1Api = require('./routes/v1.api');
const v1Gql = require('./routes/v1.graphql');

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);
app.use(morgan('combined'));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/v1', v1Api);
app.use('/v1', v1Gql);

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = {
  app,
};
