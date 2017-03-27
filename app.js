var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var schema = require('./schema/schema.js');
var analyze = require('../Lantern-analyzer/analyze');

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
var db = mongoose.createConnection('localhost');
var analyzerDB = db.useDb('analyzer_db');
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
    activitiesCollection.find({}, function(err, docs) {
      var names = [];
      docs.forEach(function(doc) {
        doc = doc._doc;
        if( doc.packageName && names.indexOf(doc.packageName) == -1 )
          names.push(doc.packageName);
      });
      res.json({'packageNames': names, 'test': 2});
    });
});

app.get('/analyze', function(req, res, next) {
	analyze.work().then(function() {
		res.json({'data': '새로 분석하였습니다!'});
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
