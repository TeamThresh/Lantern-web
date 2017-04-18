<template lang="pug">
div.device-usage-graph
	div.graph
	div.graph
	div.graph
	div.graph
	div.graph
</template>

<script>
module.exports = {
	data: function() {
		return {
			data: []
		};
	},
	methods: {
		draw: function() {
			var graphs = $('.device-usage-graph > .graph');
			$.each(graphs, function(idx, dom) {
				new Morris.Donut({
					element: dom,
					data: [
						{label: '갤럭시 S8', value: 12},
						{label: '갤럭시 S7', value: 44},
						{label: '아이폰 7', value: 12},
						{label: 'V20', value: 32}
					],
					resize: true
				});
			});
		}
	},
	mounted: function() {
		this.draw();
	}
}
</script>

<style lang="sass">
.device-usage-graph {
	width: 100%;
	height: 150px;

	.graph {
		width: 20%;
		height: 150px;
		display: inline-block;
	}
}
</style>
