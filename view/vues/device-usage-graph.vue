<template lang="pug">
div.device-usage-graph
	div.graph
		svg
	div.graph
		svg
	div.graph
		svg
	div.graph
		svg
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

			// var svg = d3.select(this.$el).select('.graph:first-child');
			// var arc = d3.arc().innerRadius(0).outerRadius(40);
			// var pie = d3.pie().sort(null).value(function(d) { return d.d = Math.random() * 100 });
			// // svg.append('arc').append('path').attr('d', arc).attr('fill', 'black').attr('stroke', 'black');
			// var g = svg.append('g').attr('transform', 'translate(50, 75)').selectAll('.arc').data(pie([{a: 65}, {b: 66}, {c: 67}])).enter().append('g');
			// g.append('path').attr('d', arc).attr('fill', 'red').attr('stroke', 'black');

			// var svg = d3.select(this.$el).select('.graph:first-child > svg'),
			//     width = $(svg.node()).width(),
			//     height = $(svg.node()).height(),
			//     radius = Math.min(width, height) / 2;
			//
			// svg = svg.append('g').attr('transform', 'translate(' + width / 2 + ', ' + height / 2 + ')');
			//
			// var pie = d3.pie()
			//     .sort(null)
			//     .value(function(d) { return d.d; });
			//
			// var path = d3.arc()
			//     .outerRadius(radius - 10)
			//     .innerRadius(0);
			//
			// var label = d3.arc()
			//     .outerRadius(radius - 40)
			//     .innerRadius(radius - 40);
			//
			// var data = [
			// 	{d: 50},
			// 	{d: 30},
			// 	{d: 10},
			// 	{d: 10}
			// ];
			//
			// var color = d3.scaleOrdinal(['#269af3', '#77f327', '#f1f326', '#ff6635']);
			//
			// var arc = svg.selectAll(".arc")
			//     .data(pie(data))
			//     .enter().append("g")
			//       .attr("class", "arc");
			//
			// arc.append("path")
			//       .attr("d", path)
			//       .attr("fill", function(d) { return color(d.index); });
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
		width: 25%;
		height: 150px;
		display: inline-block;

		svg {
			width: 100%;
			height: 100%;
		}
	}
}
</style>
