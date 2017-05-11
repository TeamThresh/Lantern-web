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
				res.forEach(r => {
					this.data.push({
						date: moment(r.collect_time)._d,
						value: r.connection
					})
				})
			})
		}
	},
	mounted() {
	}
}
</script>

<style lang="sass">
</style>
