<template lang="pug">
super-table(ref='table')
</template>

<script>
module.exports = {
	data() {
		return {
			app: this.$root.app
		}
	},
	watch: {
		'app.packageName': 'fetch',
		'app.filters': {
			handler() {
				this.fetch()
			},
			deep: true
		}
	},
	methods: {
		fetch() {
			$.get(`/api/topError/${this.app.packageName}${this.app.getFilterQuery()}`).then((res) => {
				let head = ['rank', 'count', 'name'];
				let body = [];
				res.error_rank.forEach((d, idx) => {
					body.push([idx + 1, d.count, d.crash_name]);
				});
				this.$refs.table.head = head;
				this.$refs.table.body = body;
			});
		}
	},
	mounted() {
	}
}
</script>

<style lang="css">
</style>
