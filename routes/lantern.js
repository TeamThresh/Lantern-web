var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('나도 준비중');
  res.end();
});

module.exports = router;
