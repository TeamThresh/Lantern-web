<template lang="pug">
div.dist-graph
	svg
</template>

<script>
module.exports = {
	data: function() {
		return {

		};
	},
	methods: {
		draw: function() {
			var svg = d3.select('.dist-graph > svg');
			var width = $(svg.node()).width();
			var height = $(svg.node()).height();
		}
	},
	mounted: function() {
		this.draw();
	}
}
</script>

<style lang="css" scoped>
.dist-graph svg {
	width: 100%;
	height: 300px;
}
</style>
