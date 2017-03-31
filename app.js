var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var schema = require('./schema/schema.js');
var db = require('../Lantern-analyzer/db');

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
app.use(express.static(path.join(__dirname, 'view')));

/*
db setting
*/
mongoose.connect('mongodb://localhost/lantern_raw_db');
var ResSchema = new mongoose.Schema(schema.resSchema);
var ResModel = mongoose.model('resourcemodel', ResSchema);
var analyzerDB = mongoose.createConnection('localhost').useDb('analyzer_db');
var activitiesCollection = analyzerDB.model('activities', mongoose.Schema({}, {strict: false}), 'activities');

/**
 * index redirect to /dashboard
 */
app.all('/', function(req, res, next) {
    res.redirect('/dashboard');
});

app.get('/activitySummary/:id', function(req, res, next) {
	res.sendfile(path.join(__dirname, 'view/activitySummary/index.html'));
});

// apis
app.all('/test/:id', function(req, res, next) {
  ResModel.find({}, function(err, docs) {
    // res.json(docs[docs.length - 1]);
    // res.json(docs[21]);
    if( docs.length > req.params.id )
      res.json(docs[req.params.id]);
    else
      res.json({});
    res.end();
  });
});

app.all('/testCnt', function(req, res, next) {
  ResModel.count({}, function(err, cnt) {
    res.json({'count': cnt});
    res.end();
  });
});

app.all('/testMany', function(req, res, next) {
  ResModel.find({}, function(err, docs) {
    res.json([docs[20], docs[21]]);
  });
});

app.get('/getAll', function(req, res, next) {
  ResModel.find({}, function(err, docs) {
    res.json(docs);
    res.end();
  });
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
						for( var i = 0; i < crash.length; i++ ) {
							if( crash[i].name == c.name ) {
								crash[i].count++;
								if( crash[i].topActivities.indexOf(activity.name) < 0 )
									crash[i].topActivities.push(activity.name);
								return;
							}
						}
						c.count = 1;
						c.topActivities = [];
						c.topActivities.push(activity.name);
						crash.push(c);
					});
				});
			});
		});
		res.json({'crashList': crash});
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
