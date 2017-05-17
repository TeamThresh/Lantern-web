var express = require('express');
var router = express.Router();
var db = require('../db/db');
var analyzer = require('../../Lantern-analyzer/analyzer');

router.get('/', function(req, res, next) {
	res.redirect('/dashboard');
});

router.get('/dashboard', function(req, res, next) {
	res.render('../view/pugs/dashboard.pug');
});

router.get('/activitySummary/:packageName/:activityName', function(req, res, next) {
	res.render('../view/pugs/activitySummary.pug', {
		packageName: req.params.packageName,
		activityName: req.params.activityName
	});
});

router.get('/activityDetail/:packageName/:activityName/:resourceType', function(req, res, next) {
	res.render('../view/pugs/activityDetail.pug', {
		packageName: req.params.packageName,
		activityName: req.params.activityName,
		resourceType: req.params.resourceType
	});
});

router.get('/crashList/:packageName', (req, res, next) => {
	res.render('../view/pugs/crashList.pug', {
		packageName: req.params.packageName
	});
});

// login
router.get('/login', (req, res, next) => {
	res.render('../view/pugs/login.pug')
})

module.exports = router;
