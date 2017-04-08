var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.send('hi');
	// res.redirect('/dashboard');
});

router.get('/dashboard', function(req, res, next) {
	res.send('hi');
	res.end();
	// res.render('view/dashboard/index.pug');
});

module.exports = router;
