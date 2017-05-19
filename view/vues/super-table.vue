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
	props: ['type'],
	data: function() {
		return {
			head: [],
			body: [],
			app: this.$root.app,
			fetchUrl: ''
		};
	},
	watch: {
		'app.packageName'() {
			this.fetch()
		},
		'app.filters': {
			handler() {
				this.fetch()
			},
			deep: true
		}
	},
	methods: {
		fetch() {
			let url = ''
			switch( this.type ) {
				case 'network':
					url = `/api/network/${this.app.packageName}/${this.app.activityName}`
					break
				case 'crash5':
					url = '?limit=5'
				case 'crash':
					url = `/api/crashCount/${this.app.packageName}${url}`
					break
			}
			$.get(url).then(res => {
				this.clear()
				let data = res.reverse()
				data.forEach(d => {
					let row = []
					Object.keys(d).forEach(h => {
						if( this.head.indexOf(h) < 0 ) {
							this.head.push(h)
						}
						row.push(d[h])
					})
					this.body.push(row)
				})
			})
		},
		clear() {
			this.head = []
			this.body = []
		},
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
	}
}
</script>

<style scoped lang="sass">
	table.table {
		background-color: transparent;
		color: black;
		border: none;
	}

	tr {
		background-color: transparent !important;

		&:hover {
			background-color: rgba(0, 0, 0, 0.0625) !important;
		}
	}

	table, .table-scrollable, tr, th, td {
		border: none;
		border-top: none !important;
	}

	th {
		border: 1px solid #2e3139 !important;
		/*background-color: #585f72;*/
		color: black;
		font-size: 12px;
		font-weight: bold;
	}
</style>
