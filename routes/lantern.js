var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.redirect('/dashboard');
});

router.get('/dashboard', function(req, res, next) {
	res.render('../view/pugs/dashboard.pug');
});

module.exports = router;
