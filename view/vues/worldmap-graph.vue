<template lang="pug">
div.worldmap-graph
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
			$(this.$el).vectorMap({
			    map: 'world_en',
				backgroundColor: '',
			    borderColor: '#818181',
			    borderOpacity: 0.25,
			    borderWidth: 1,
			    color: 'rgb(90, 92, 103)',
			    enableZoom: true,
			    hoverColor: '#c9dfaf',
			    hoverOpacity: null,
			    normalizeFunction: 'linear',
			    scaleColors: ['#b6d6ff', '#005ace'],
			    selectedColor: '#c9dfaf',
			    selectedRegions: null,
			    showTooltip: true,
			    onRegionClick: function(element, code, region)
			    {
			        var message = 'You clicked "'
			            + region
			            + '" which has the code: '
			            + code.toUpperCase();

			        alert(message);
			    }
			});
		}
	},
	mounted: function() {
		this.draw();
	}
}
</script>

<style lang="sass">
.worldmap-graph {
	width: 100%;
	height: 300px;

	.jqvmap-zoomin, .jqvmap-zoomout{
		width: 15px;
		height: 15px;
		background-color: white;
		color: black;
	}
}
</style>
