var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;
var p; // Promise
var store = module.exports = {};
var mongodbServerIp = '10.99.0.11';

// db 연결 및 model 생성
store.mongodb = mongodb;
store.p = mongoClient.connect('mongodb://' + mongodbServerIp).then(function(db) {
	return new Promise(function(s, f) {
		db = db.db('lantern_raw_db');
		store.db = db;
		store.resourcemodels = db.collection('resourcemodels');
		store.analyzed = db.collection('analyzed');

		// 필요한 몇몇 쿼리 함수들 warpping
		store.analyzed.isPackageExists = function(packageName) {
			return new Promise(function(s, f) {
				store.analyzed.count({'package_name': packageName}, function(e, c) {
					s(c > 0);
				});
			});
		};

		store.analyzed.putPackage = function(packageName) {
			return new Promise(function(s, f) {
				store.analyzed.insert({'package_name': packageName}, function() {
					s();
				});
			});
		};

		store.analyzed.putDump = function(packageName, dump) {
			return new Promise(function(s, f) {
				store.analyzed.update({'package_name': packageName}, {'$push': {'dumps': dump}}, function() {
					s();
				});
			});
		};

		s();
	});
});