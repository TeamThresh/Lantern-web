<template lang="pug">
div.table-scrollable
	table.table.table-striped(:class='{light: light}')
		thead
			tr
				th.text-center(v-for='name in head') {{name}}
		tbody
			tr(@click='click(b, $event)', v-for='b in body')
				td.text-center(v-for='d in b') {{d}}
</template>

<script>
module.exports = {
	props: ['type', 'light', 'stopWatchPackageName', 'toDetail', 'watchFilters', 'stopWatchIsInitDone', 'watchUuid'],
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
			if( ! this.app.isInitDone ) {
				return
			}
			if( this.stopWatchPackageName !== undefined ) {
				return
			}
			this.fetch()
		},
		'app.filters': {
			handler() {
				if( ! this.app.isInitDone ) {
					return
				}
				if( this.watchFilters !== undefined ) {
					this.fetch()
				}
			},
			deep: true
		},
		'app.distSelection': {
			handler() {
				if( ! this.app.isInitDone ) {
					return
				}
				this.fetch()
			},
			deep: true
		},
		'app.isInitDone'() {
			if( ! this.app.isInitDone ) {
				return
			}
			if( this.stopWatchIsInitDone !== undefined ) {
				return
			}
			this.fetch()
		},
		'app.uuid'() {
			if( ! this.app.isInitDone ) {
				return
			}
			if( this.watchUuid == undefined ) {
				return
			}
			this.fetch()
		}
	},
	methods: {
		fetch() {
			let url = ''
			let query = this.app.getFilters()
			//uuid
			query.uuid = this.app.uuid.join(',')

			// no need to be reversed
			let doNotReverse = false

			switch( this.type ) {
				case 'network':
					url = `/api/network/${this.app.packageName}/${this.app.activityName}`
					break
				case 'crash5':
					query.limit = 5
					url = `/api/crashCount/${this.app.packageName}`
					doNotReverse = true
					break
				case 'crash':
					url = `/api/crashCount/${this.app.packageName}/${this.app.activityName}`
					doNotReverse = true
					break
				case 'userList':
					switch( this.app.resourceType ) {
						case 'cpu':
							url = `/api/userList/${this.app.packageName}/${this.app.activityName}/cpu`
							break
						case 'memory':
							url = `/api/userList/${this.app.packageName}/${this.app.activityName}/memory`
							break
						case 'rendering':
							url = `/api/userList/${this.app.packageName}/${this.app.activityName}/ui`
							break
					}
					query.startRange = this.app.distSelection.startRange > 0 ? this.app.distSelection.startRange : query.startRange
					query.endRange = this.app.distSelection.endRange > 0 ? this.app.distSelection.endRange : query.endRange
					query.startUsage = this.app.distSelection.startUsage
					query.endUsage = this.app.distSelection.endUsage
					break
				case 'detailOs':
					url = `/api/cpu/detailOS/${this.app.packageName}/${this.app.activityName}`
					query.startRange = this.app.distSelection.startRange > 0 ? this.app.distSelection.startRange : query.startRange
					query.endRange = this.app.distSelection.endRange > 0 ? this.app.distSelection.endRange : query.endRange
					query.startUsage = this.app.distSelection.startUsage
					query.endUsage = this.app.distSelection.endUsage
					break
				case 'detailCpuApp':
					url = `/api/cpu/detailApp/${this.app.packageName}/${this.app.activityName}`
					query.startRange = this.app.distSelection.startRange > 0 ? this.app.distSelection.startRange : query.startRange
					query.endRange = this.app.distSelection.endRange > 0 ? this.app.distSelection.endRange : query.endRange
					query.startUsage = this.app.distSelection.startUsage
					query.endUsage = this.app.distSelection.endUsage
					break
				case 'detailVmStat':
					url = `/api/memory/vmstat/${this.app.packageName}/${this.app.activityName}`
					query.startRange = this.app.distSelection.startRange > 0 ? this.app.distSelection.startRange : query.startRange
					query.endRange = this.app.distSelection.endRange > 0 ? this.app.distSelection.endRange : query.endRange
					query.startUsage = this.app.distSelection.startUsage
					query.endUsage = this.app.distSelection.endUsage
					break
				case 'detailMemoryApp':
					url = `/api/memory/detailApp/${this.app.packageName}/${this.app.activityName}`
					query.startRange = this.app.distSelection.startRange > 0 ? this.app.distSelection.startRange : query.startRange
					query.endRange = this.app.distSelection.endRange > 0 ? this.app.distSelection.endRange : query.endRange
					query.startUsage = this.app.distSelection.startUsage
					query.endUsage = this.app.distSelection.endUsage
					break
			}
			$.ajax({type: 'get', url: url, data: query}).then(res => {
				this.clear()
				let data = res
				if( ! doNotReverse ) {
					data = data.reverse()
				}
				let newData = []
				data.forEach(d => {
					let row = []
					Object.keys(d).forEach(h => {
						if( this.head.indexOf(h) < 0 ) {
							this.head.push(h)
						}
						// timestamp must be readable format
						if( h == 'time' || h == 'timestamp' || h == 'start_time' || h == 'end_time') {
							d[h] = moment(d[h]).format('YYYY-MM-DD HH:mm:ss')
						}
						row.push(d[h])
					})
					newData.push(row)
				})
				this.body = newData
			})
		},
		clear() {
			this.head = []
			this.body = []
			$(this.$el).find('.selected').removeClass('selected')
		},
		click(d, $event) {
			if( this.type == 'userList' ) {
				if( this.app.uuid.indexOf(d[0]) > -1 ) {
					this.app.uuid.splice(this.app.uuid.indexOf(d[0]), 1)
				} else {
					this.app.uuid.push(d[0])
				}
				// select mark
				let elem = $($event.srcElement)
				while( elem.prop('tagName') != 'TR' ) {
					elem = $(elem).parent()
				}
				$(elem).toggleClass('selected')
			} else if( this.toDetail !== undefined ) {
				location.href = `/crashDetail/${this.app.packageName}/${d[0]}`
			}
		}
	},
	mounted: function() {
	}
}
</script>

<style scoped lang="scss">
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

	table tr.selected {
		background-color: chartreuse !important;
	}
</style>
