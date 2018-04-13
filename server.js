require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

//Endpoint goes here!

app.listen(process.env.PORT , () => console.log(`app listening on port ${process.env.PORT}!`));
