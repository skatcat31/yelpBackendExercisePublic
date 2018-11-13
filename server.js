require('dotenv').config();
const Promise = require('bluebird');

const express = require('express');
const bodyParser = require('body-parser');
const { YELP_REVERSE_PROXY_ENDPOINT, YELP_REVERSE_PROXY_HANDLERS } = require('./YELP.proxy.route');
const plugins = require('./plugins');

const app = express();

app.locals.plugins = plugins;

app.use(bodyParser.json());

//Endpoint goes here!
app.post(
  YELP_REVERSE_PROXY_ENDPOINT,
  YELP_REVERSE_PROXY_HANDLERS
)

app.listen(process.env.PORT, () => console.log(`app listening on port ${process.env.PORT}!`));
