const mongoose = require('mongoose');

// const MONGO_USERNAME = 'sammy';
// const MONGO_PASSWORD = 'password';
// const MONGO_HOSTNAME = '127.0.0.1';
// const MONGO_PORT = '27017';
// const MONGO_DB = 'sharkinfo';

const {
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_HOSTNAME,
    MONGO_PORT,
    MONGO_DB
} = process.env;

const options = {
    useNewUrlParser: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    connectTimeoutMS: 1000
};

const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

// mongoose.connect(url, {useNewUrlParser: true});

mongoose.connect(url, options).then( function() {
    console.log('MongoDB is connected');
})
.catch( function(err) {
    console.log('ERROR: ', err);
});
