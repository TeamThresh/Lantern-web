<template lang="pug">
line-graph.user-connection-graph(:initData='data')
</template>

<script>
module.exports = {
	data() {
		return {
			app: this.$root.app,
			data: []
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
				let arr = []
				res.forEach(r => {
					arr.push({
						date: moment(r.collect_time)._d,
						value: r.connection
					})
				})
				// pre-precess
				// same scaled range, same domain!
				// xScale을 이용해 동일한 range를 가지면 합산해버린다
				let svg = d3.select(this.$el).select('svg');
				let width = $(svg.node()).width();
				let xScale = d3.scaleTime()
					.domain([arr[0].date, arr[arr.length - 1].date])
					.range([23, width - 10]);
				let beforeRange = Math.floor(xScale(arr[0].date))
				for( let i=1; i<arr.length; i++ ) {
					if( beforeRange == Math.floor(xScale(arr[i].date)) ) {
						arr[i - 1].value += arr[i].value
						arr.splice(i, 1)
						i--;
					} else {
						beforeRange = Math.floor(xScale(arr[i].date))
					}
				}
				this.data = arr
			})
		}
	},
	mounted() {
	}
}
</script>

<style lang="sass">
</style>
