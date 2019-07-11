const express = require('express');
const router = express.Router();
const path = require('path');

router.use (function (req,res,next) {
  console.log('/' + req.method);
  next();
});

router.get('/',function(req,res){
  res.sendFile(path.resolve('views/index.html'));
});

// router.get('/test', function(req, res){
//     res.send('Hit the "test" route.');
// });

module.exports = router;
