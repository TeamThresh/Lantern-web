<template lang="pug">
div.line-graph
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
			new Morris.Line({
				element: this.$el,
				data: [
				    { y: '2006', a: 100, b: 90 },
				    { y: '2007', a: 75,  b: 65 },
				    { y: '2008', a: 50,  b: 40 },
				    { y: '2009', a: 75,  b: 65 },
				    { y: '2010', a: 50,  b: 40 },
				    { y: '2011', a: 75,  b: 65 },
				    { y: '2012', a: 100, b: 90 }
				],
				xkey: 'y',
				ykeys: ['a', 'b'],
				labels: ['Series A', 'Series B']
			});
		}
	},
	mounted: function() {
		this.draw();
	}
}
</script>

<style lang="sass">
.line-graph {
	width: 100%;
	height: 150px;
}
</style>
