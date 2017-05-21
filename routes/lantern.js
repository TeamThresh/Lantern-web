var express = require('express');
var router = express.Router();
var db = require('../db/db');
var analyzer = require('../../Lantern-analyzer/analyzer');

const SESSION_NAME = 'LANTERNSESSIONID';

router.get('/', function(req, res, next) {
	if( req.cookies[SESSION_NAME] ) {
		res.redirect('/index');
	} else {
		res.redirect('/login');
	}
});

router.get('/index', (req, res, next) => {
	res.render('../view/pugs/index.pug')
})

router.get('/dashboard/:packageName', function(req, res, next) {
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

router.get('/crashDetail/:packageName/:crashName', (req, res, next) => {
	res.render('../view/pugs/crashDetail.pug', {
		packageName: req.params.packageName,
		crashName: req.params.crashName
	});
});

// login
router.get('/login', (req, res, next) => {
	if( req.cookies[SESSION_NAME] ) {
		res.redirect('/dashboard')
	} else {
		res.render('../view/pugs/login.pug')
	}
})

module.exports = router;
