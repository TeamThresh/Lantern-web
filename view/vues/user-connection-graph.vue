<template lang="pug">
div.user-connection-graph
	div.title 접속률
	line-graph(:initData='connectionData')
	br
	div.title 복귀율
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
			this.fetch()
		}
	},
	methods: {
		fetch() {
			let tmpRangeQuery = `&startRange=${moment('2017-03-01').valueOf()}&endRange=${moment('2017-04-30').valueOf()}`
			$.get(`/api/userCount/${this.app.packageName}${this.app.getFilterQuery()}${tmpRangeQuery}`).then(res => {
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
				let xScale1 = d3.scaleTime()
					.domain([arr1[0].date, arr1[arr1.length - 1].date])
					.range([23, width - 10]);
				let xScale2 = d3.scaleTime()
					.domain([arr2[0].date, arr2[arr2.length - 1].date])
					.range([23, width - 10]);

				let beforeRange = Math.floor(xScale1(arr1[0].date))
				for( let i=1; i<arr1.length; i++ ) {
					if( beforeRange == Math.floor(xScale1(arr1[i].date)) ) {
						arr1[i - 1].value += arr1[i].value
						arr1.splice(i, 1)
						i--;
					} else {
						beforeRange = Math.floor(xScale1(arr1[i].date))
					}
				}
				beforeRange = Math.floor(xScale2(arr2[0].date))
				for( let i=1; i<arr2.length; i++ ) {
					if( beforeRange == Math.floor(xScale2(arr2[i].date)) ) {
						arr2[i - 1].value += arr2[i].value
						arr2.splice(i, 1)
						i--;
					} else {
						beforeRange = Math.floor(xScale2(arr2[i].date))
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
