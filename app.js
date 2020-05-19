const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const { PORT } = require('./config');
const indexRoutes = require('./routes/index');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

app.get('*', (req, res, next) => {
  if (!req.path.includes('api')) {
    res.sendFile(path.join(__dirname, 'index.html'), (err) => {
      if (err) {
        res.status(500).send(err);
      }
    });
  } else {
    next();
  }
});

app.use('/api', indexRoutes);
app.use('/*', (req, res) => {
  res.status(404).send({
    status: 'FAILED',
    message: 'Not Found',
  });
});

app.listen(PORT, () => {
  console.log(`Server Started on PORT ${PORT}`);
});
