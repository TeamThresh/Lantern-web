<template lang="pug">
div.table-scrollable
	table.table.table-striped(:class='{light: light}')
		thead
			tr
				th.text-center(v-for='name in head') {{name}}
		tbody
			tr(v-for='b in body', @click='click(b)')
				td.text-center(v-for='d in b') {{d}}
</template>

<script>
module.exports = {
	props: ['type', 'light', 'stopWatchPackageName', 'toDetail'],
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
			if( this.stopWatchPackageName ) {
				return
			}
			this.fetch()
		},
		'app.filters': {
			handler() {
				// this.fetch()
			},
			deep: true
		},
		'app.distSelection': {
			handler() {
				this.fetch()
			},
			deep: true
		}
	},
	methods: {
		fetch() {
			let url = ''
			let query = this.app.getFilters()
			switch( this.type ) {
				case 'network':
					url = `/api/network/${this.app.packageName}/${this.app.activityName}`
					break
				case 'crash5':
					query.limit = 5
				case 'crash':
					url = `/api/crashCount/${this.app.packageName}`
					break
				case 'userList':
					url = `/api/userList/${this.app.packageName}/${this.app.activityName}/${this.app.resourceType}`
					query.startRange = this.app.distSelection.startRange > 0 ? this.app.distSelection.startRange : query.startRange
					query.endRange = this.app.distSelection.endRange > 0 ? this.app.distSelection.endRange : query.endRange
					query.startUsage = this.app.distSelection.startUsage
					query.endUsage = this.app.distSelection.endUsage
					break
			}
			$.ajax({type: 'get', url: url, data: query}).then(res => {
				this.clear()
				let data = res.reverse()
				data.forEach(d => {
					let row = []
					Object.keys(d).forEach(h => {
						if( this.head.indexOf(h) < 0 ) {
							this.head.push(h)
						}
						// timestamp must be readable format
						if( h == 'time' || h == 'timestamp' ) {
							d[h] = moment(d[h]).format('YYYY-MM-DD HH:mm:ss')
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
		click(d) {
			if( this.type == 'userList' ) {
				this.app.uuid = d[0]
				this.app.timestampForUuid = d[6]
			} else if( this.toDetail !== undefined ) {
				location.href = `/crashDetail/${this.app.packageName}/${d[0]}`
			}
		}
	},
	mounted: function() {
	}
}
</script>

<style scoped lang="sass">
	table.table {
		background-color: transparent;
		border: none;
		color: black;
	}

	tr {
		background-color: transparent !important;
		cursor: pointer;

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

	table.table.light {
		color: white;

		th {
			border: 1px solid #2e3139 !important;
			background-color: #585f72;
			color: white !important;
		}
	}
</style>
