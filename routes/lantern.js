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

router.get('/activityDetail/:resourceType/:packageNAme/:activityName', function(req, res, next) {
	res.render('../view/pugs/activityDetail.pug', {
		packageName: req.params.packageName,
		activityName: req.params.activityNameg,
		resourceType: req.params.resourceType
	});
});

router.get('/crashList', (req, res, next) => {
	res.render('../view/pugs/crashList.pug', {

	});
});

module.exports = router;
