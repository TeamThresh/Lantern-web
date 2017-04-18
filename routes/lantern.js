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

router.get('/analyze', function(req, res, next) {
	var cnt = 0;
	db.p.then(function() {
		db.analyzed.drop(function(err) {
			db.resourcemodels.find({}).toArray(function(e, docs) {
				var work = function(idx) {
					if( idx >= docs.length ) {
						res.json({cnt: cnt});
					}
					cnt++;
					var package = analyzer.parsePackage(docs[idx]);
					db.analyzed.isPackageExists(package.package_name).then(function(b) {
						if( ! b )
						db.analyzed.putPackage(package.package_name);
						db.analyzed.putDump(package.package_name, package.dumps[0]).then(function() {
							work(idx + 1);
						});
					});
				};
				work(0);
			});
		});
	});
});

module.exports = router;
