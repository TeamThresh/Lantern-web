<template lang="pug">
div.table-scrollable
	table.table.table-striped
		thead
			tr
				th.text-center(v-for='name in head') {{name}}
		tbody
			tr(v-for='b in body')
				td.text-center(v-for='d in b') {{d}}
</template>

<script>
module.exports = {
	props: ['initData', 'url'],
	data: function() {
		return {
			head: [],
			body: []
		};
	},
	methods: {
		transformData: function(data) {
			/**
			 * data should be formed like one of below
			 * and this method will transform from passed data to Object type 1
			 * actually it doesn't work right now(2017-03-28) ..... sorry I dont want to work anymore
			 * - Object type1
			 * {
			 * 		head: ['a', 'b', 'c', 'd', ...],
			 * 		body: [
			 * 			['a', 'b', 'c', 'd', ...],
			 * 			['a', 'b', 'c', 'd', ...],
			 * 			['a', 'b', 'c', 'd', ...]...
			 * 		]
			 * }
			 * - Object type2
			 * {
			 * 		head: ['a', 'b', 'c', 'd', ...],
			 * 		body: [
			 * 			{
			 * 				'a': 'a',
			 * 				'b': 'b',
			 * 				'c': 'c',
			 * 				'd': 'd'...
			 * 			},
			 * 			{
			 * 				'a': 'a',
			 * 				'b': 'b',
			 * 				'c': 'c',
			 * 				'd': 'd'...
			 * 			}...
			 * 		]
			 * }
			 * - Array type
			 * [
			 * 		{
			 * 			'a': 'a',
			 * 			'b': 'b',
			 * 			'c': 'c',
			 * 			'd': 'd'...
			 * 		},
			 * 		{
			 * 			'a': 'a',
			 * 			'b': 'b',
			 * 			'c': 'c',
			 * 			'd': 'd'...
			 * 		},
			 * 		{
			 * 			'a': 'a',
			 * 			'b': 'b',
			 * 			'c': 'c',
			 * 			'd': 'd'...
			 * 		}...
			 * ]
			 */
			var me = this;
			me.data = {};
			// Object type
			if( data instanceof Object ) {

			}
		},
		createRandomCrashName(n) {
			let tmp = '';
			for( let i=0; i<n; i++ ) {
				tmp += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
				if( i % 10 == 0 ) {
					tmp += '.';
				}
			}
			return tmp;
		}
	},
	mounted: function() {
		var me = this;
		if( me.initData ) {
			if( me.initData == 'crash' ) {
				this.head = ['rank', 'count', 'name'];
				this.body = [];
				for( var i=0; i<100; i++ ) {
					this.body.push([i + 1, Math.round(Math.random() * 255), this.createRandomCrashName(Math.floor(Math.random() * 20) + 30)]);
				}
			}
		} else if( me.url ) {
			$.get(me.url).then(function(d) {
				me.head = ['name', 'timestamp', 'activity'];
				me.body = [];
				$.each(d.crashList, function(i, c) {
					me.body.push([c.name, moment(c.timestamp).format('YYYY-MM-DD HH:MM:SS'), c.topActivity]);
				});
			});
		} else {
			var packageName = location.pathname.split('/')[2];
			var activityName = location.pathname.split('/')[3];
			$.get('/getCrashList/' + packageName).then(function(d) {
				me.head = ['name', 'timestamp', 'activity'];
				me.body = [];
				$.each(d.crashList, function(i, c) {
					if( c.topActivity == activityName )
						me.body.push([c.name, moment(c.timestamp).format('YYYY-MM-DD HH:MM:SS'), c.topActivity]);
				});
			});
		}
	}
}
</script>

<style scoped lang="css">
	table.table {
		background-color: transparent;
		color: white;
		border: none;
	}

	tr {
		background-color: transparent !important;
	}

	table, .table-scrollable, tr, th, td {
		border: none;
		border-top: none !important;
	}

	th {
		border: 1px solid #2e3139 !important;
		background-color: #585f72;
		color: #fff;
		font-size: 12px;
		font-weight: bold;
	}
</style>
