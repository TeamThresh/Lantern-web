var express = require('express');
var router = express.Router();
var db = require('../db/db');

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
	db.p.then(function() {
		db.analyzed.drop(function(err) {
			db.resourcemodels.find({}).toArray(function(e, docs) {
				var work = function(idx) {
					if( idx >= docs.length ) {
						res.send('done');
					}
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

// api
router.get('/api/getAllPackageNames', function(req, res, next) {
	db.analyzed.find({}, {'package_name': 1}).toArray(function(err, docs) {
		var names = [];
		docs.forEach(function(doc) {
			if( doc.package_name && names.indexOf(doc.package_name) == -1 )
				names.push(doc.package_name);
		});
		res.json({'packageNames': names});
	});
});

router.get('/api/getNodesAndLinks/:packageName', function(req, res, next) {
	db.analyzed.find({'package_name': req.params.packageName}, {'dumps.nodes': 1, 'dumps.links': 1}).toArray(function(err, docs) {
		var nodes = [];
		var links = [];
		var addNode = function(node) {
			(function() {
				for(var i = 0; i < nodes.length; i++ ) {
					if( nodes[i].name == node.name ) {
						nodes[i].usageCount += node.usage_count;
						nodes[i].crashCount += node.crash_count;
						return;
					}
				};
				nodes.push({
					'name': node.name,
					'usageCount': node.usage_count,
					'crashCount': node.crash_count
				});
			})();
		};
		var addLink = function(link) {
			(function() {
				for(var i = 0; i < links.length; i++ ) {
					if( links[i].source == link.source && links[i].target == link.target ) {
						links[i].value += link.value;
						return;
					}
				};
				links.push(link);
			})();
		};
		docs.forEach(function(doc) {
			doc.dumps.forEach(function(dump) {
				dump.nodes.forEach(function(node) {
					addNode(node);
				});
				dump.links.forEach(function(link) {
					addLink(link);
				});
			});
		});
		res.json({'nodes': nodes, 'links': links});
	});
});

router.get('/api/getCrashList/:packageName', function(req, res, next) {
	db.analyzed.find({'package_name': req.params.packageName}, {'dumps.activities.name': 1, 'dumps.activities.crash': 1}).toArray(function(err, docs) {
		var crash = [];
		docs.forEach(function(doc) {
			doc.dumps.forEach(function(dump) {
				dump.activities.forEach(function(activity) {
					activity.crash.forEach(function(c) {
						// for( var i = 0; i < crash.length; i++ ) {
						// 	if( crash[i].name == c.name ) {
						// 		crash[i].count++;
						// 		if( crash[i].topActivities.indexOf(activity.name) < 0 )
						// 			crash[i].topActivities.push(activity.name);
						// 		return;
						// 	}
						// }
						// c.count = 1;
						// c.topActivities = [];
						// c.topActivities.push(activity.name);
						// crash.push(c);
						c.topActivity = activity.name;
						crash.push(c);
					});
				});
			});
		});
		res.json({'crashList': crash});
	});
});

module.exports = router;
