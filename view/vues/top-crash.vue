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
	mounted() {
		$.get(`/api/topError/${app.packageName}`).then((res) => {
			let head = ['rank', 'count', 'name'];
			let body = [];
			res.error_rank.forEach((d, idx) => {
				body.push([idx, d.count, d.name]);
			});
			this.$refs.table.data = {head: head, body: body};
		});
	}
}
</script>

<style lang="css">
</style>
