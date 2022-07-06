const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();
app.use([cors(), morgan('dev'), express.json()]);

app.use('/auth', require('./authRoute'));
app.use('/', require('./appRoute'));

app.use('/health', (_req, res) => {
  res.status(200).json({ message: 'OK' });
});

mongoose.connect('mongodb://localhost:27017/api-security').then(() => {
  app.listen(4000, () => {
    console.log('Server is listening on port 4000');
  });
  console.log('database connected');
});
