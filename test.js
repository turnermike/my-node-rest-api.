const express = require('express');
const app = express();
const router = express.Router();

// load environmeht variables from .env file to process.env
const dotenv = require('dotenv');
const dotenvResult = dotenv.config({ path: './.env'});
console.log('.env vars: ', dotenvResult.parsed);

// app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('This thing on?');
});

const port = 3000;
app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
});
