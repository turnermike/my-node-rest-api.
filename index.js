const express = require('express');
const app = express();
const router = express.Router();
const db = require('./db');
const sharks = require('./routes/sharks');


// load environmeht variables from .env file to process.env
const dotenv = require('dotenv');
const dotenvResult = dotenv.config();
console.log('.env vars: ', dotenvResult.parsed);

const path = __dirname + '/views/';
const port = process.env.PORT || 3000;

// app.get('/', (req, res) => {
//     res.send('This thing on?');
// });

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path));
app.use('/sharks', sharks);

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
})
