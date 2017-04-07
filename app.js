var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db = require('./db/db');
var analyzer = require('../Lantern-analyzer/analyzer');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// static
app.use('/assets', express.static(path.join(__dirname, 'view/assets')));

/**
 * index redirect to /dashboard
 */
app.all('/', function(req, res, next) {
    res.redirect('/dashboard');
});

app.get('/activitySummary/:packageName/:activityName', function(req, res, next) {
	res.sendfile(path.join(__dirname, 'view/activitySummary/index.html'));
});

app.get('/getPackageData/:name', function(req, res, next) {
    activitiesCollection.find({'packageName': req.params.name}, function(err, docs) {
      res.json(docs);
    });
});

app.get('/getAllPackageNames', function(req, res, next) {
	db.analyzed.find({}, {'package_name': 1}).toArray(function(err, docs) {
		var names = [];
		docs.forEach(function(doc) {
			if( doc.package_name && names.indexOf(doc.package_name) == -1 )
				names.push(doc.package_name);
		});
		res.json({'packageNames': names});
	});
});

app.get('/getNodesAndLinks/:packageName', function(req, res, next) {
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

app.get('/getCrashList/:packageName', function(req, res, next) {
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

app.get('/analyze', function(req, res, next) {
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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render('error');
  // TODO : error html 준비해야함
  res.end();
  next();
});

module.exports = app;
