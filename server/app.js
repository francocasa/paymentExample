const dotenv = require('dotenv');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
dotenv.config({ path: envFile });

const configExpress = require('./config/express');
const routes = require('./routes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

configExpress(app);

routes(app);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error' });
});

module.exports = app;
