const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

// const {
//     MONGO_USERNAME,
//     MONGO_PASSWORD,
//     MONGO_HOSTNAME,
//     MONGO_PORT,
//     MONGO_DB
// } = process.env;


const options = {
    useNewUrlParser: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    connectTimeoutMS: 1000
};

// const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;
const url = process.env.MONGO_URL;
console.log('url', url);


mongoose.connect(url, options).then( function() {
    console.log('MongoDB is connected');
})
.catch( function(err) {
    console.log('ERROR: ', err);
});
