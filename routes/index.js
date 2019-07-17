const express = require('express');
const router = express.Router();
// const path = require('path');

// router.use (function (req,res,next) {
//   console.log('/' + req.method);
//   next();
// });


router.post('/addshark', function(req, res) {
    res.send('hi?');
});

module.exports = router;
