<template lang="pug">
div.radar-chart
</template>

<script>
module.exports = {
	data: function () {
		return {

		};
	},
	methods: {
		draw: function() {
			var data = [
					  [
						  {'area': 'UI Rendring', 'value': 3},
						  {'area': 'CPU', 'value': 5},
						  {'area': 'Memory', 'value': 2},
						  {'area': 'Network', 'value': 1},
						  {'area': 'Crash', 'value': 5}
					  ]
			];
			var me = this;
			var width = $(me.$el).width();
			var height = $(me.$el).height();

			// not selector. should pass dom element
			me.drawRadarChart('.radar-chart', data, {
				w: width - 150,
				h: height - 100,
				maxValue : 5,
				levels: 5,
				roundStrokes: true,
				color: d3.scaleOrdinal(d3.schemeCategory10)
			});
		},
		drawRadarChart: require('../../assets/d3/radar.js').drawRadarChart
	},
	mounted: function() {
		var me = this;
		me.draw();
	}
}
</script>

<style lang="sass">
	.radar-chart {
		width: 300px;
		height: 250px;
	}
</style>
