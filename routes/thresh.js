var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('준비중2');
  res.end();
});

module.exports = router;
