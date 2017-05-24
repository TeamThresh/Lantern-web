<template lang="pug">
div.worldmap-graph
</template>

<script>
module.exports = {
	data: function() {
		return {
			data: [],
			app: this.$root.app
		};
	},
	watch: {
		'app.packageName'() {
			if( ! this.app.isInitDone ) {
				return
			}
			this.fetch()
		},
		'app.filters': {
			handler() {
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
			$.get(`/api/location/${this.app.packageName}`, this.app.getFilters()).then((res) => {
				this.draw(res);
			});
		},
		draw: function(data) {
			var gdpData = {};
			for( let d of data ) {
				let code = d.country_code.toLowerCase();
				let value = 0;
				if( d.usage_count == 0 ) {
					value = 0;
				} else {
					if( d.crash_count > 0 ) {
						value = d.crash_count / d.usage_count;
					} else {
						value = d.usage_count;
					}
				}
				gdpData[code] = 'lightblue';
			}

			let colors = gdpData;

			$(this.$el).find('*').remove()

			$(this.$el).vectorMap({
			    map: 'world_en',
				backgroundColor: '',
			    borderColor: '#818181',
			    borderOpacity: 0.25,
			    borderWidth: 1,
				color: 'rgb(90, 92, 103)',
			    colors: colors,
			    enableZoom: true,
			    hoverColor: false,
			    hoverOpacity: 0.7,
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
