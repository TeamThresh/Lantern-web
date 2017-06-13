<template lang="pug">
div.user-connection-graph
	div.title Connections
	line-graph(:initData='connectionData')
	br
	div.title Retentions
	line-graph(:initData='retentionData')
</template>

<script>
module.exports = {
	data() {
		return {
			app: this.$root.app,
			connectionData: [],
			retentionData: []
		}
	},
	watch: {
		'app.packageName': function() {
			if( ! this.app.isInitDone ) {
				return
			}
			this.fetch()
		},
		'app.filters': {
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
			this.fetch()
		}
	},
	methods: {
		fetch() {
			$.get(`/api/userCount/${this.app.packageName}`, this.app.getFilters()).then(res => {
				let arr1 = []
				let arr2 = []
				res.forEach(r => {
					arr1.push({
						date: moment(r.collect_time)._d,
						value: r.connection
					})
					arr2.push({
						date: moment(r.collect_time)._d,
						value: r.retention
					})
				})
				// pre-precess
				// same scaled range, same domain!
				// xScale을 이용해 동일한 range를 가지면 합산해버린다
				let svg = d3.select(this.$el).select('svg');
				let width = $(svg.node()).width();
				let date = this.app.getRange()
				let xScale = d3.scaleTime()
					.domain([date.startRange, date.endRange])
					.range([23, width - 10])

				if( arr1.length > 0 ) {
					let beforeRange = Math.floor(xScale(arr1[0].date))
					for( let i=1; i<arr1.length; i++ ) {
						if( beforeRange == Math.floor(xScale(arr1[i].date)) ) {
							arr1[i - 1].value += arr1[i].value
							arr1.splice(i, 1)
							i--;
						} else {
							beforeRange = Math.floor(xScale(arr1[i].date))
						}
					}
				}
				if( arr2.length > 0 ) {
					let beforeRange = Math.floor(xScale(arr2[0].date))
					for( let i=1; i<arr2.length; i++ ) {
						if( beforeRange == Math.floor(xScale(arr2[i].date)) ) {
							arr2[i - 1].value += arr2[i].value
							arr2.splice(i, 1)
							i--;
						} else {
							beforeRange = Math.floor(xScale(arr2[i].date))
						}
					}
				}

				this.connectionData = arr1
				this.retentionData = arr2
			})
		}
	},
	mounted() {
	}
}
</script>

<style lang="sass">
.user-connection-graph {
	padding: 10px 10px 10px 10px;
	background-color: #2e3139;
	border-radius: 5px !important;

	div.title {
		margin: 0 0 5px 0;
		color: #fff;
		font-weight: bold;
		font-size: 13px;
	}
}
</style>
