<template lang="pug">
div.table-scrollable
	table.table.table-striped.table-hover
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
		}
	},
	created: function() {
		var me = this;
		if( me.initData ) {
			me.head = me.initData.head;
			me.body = me.initData.body;
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

<style lang="sass">
</style>
