<template lang="pug">
div.one-depth-user-flow
	svg
</template>

<script>
module.exports = {
	mounted: function() {
		this.draw();
	},
	data: function() {
		return {
			data:{
				"nodes": [
					{"name":"Main Activity"},
					{"name":"Preview Activity"},
					{"name":"Setting Activity"},
					{"name":"Crashed"},
					{"name":"Exit"}
				],
				"links": [
					{"source":0,"target":1,"value":2},
					{"source":0,"target":2,"value":5},
					{"source":0,"target":3,"value":1},
					{"source":0,"target":4,"value":1}
				]
			}
		};
	},
	methods: {
		draw: function() {
			var svg = d3.select('div.one-depth-user-flow > svg');
			var units = "Widgets";

			// set the dimensions and margins of the graph
			var margin = {top: 10, right: 10, bottom: 10, left: 10};
			var width = $(svg.node()).width() - 20;
			var height = $(svg.node()).height() - 20;

			// format variables
			var formatNumber = d3.format(",.0f"),		// zero decimal places
				format = function(d) { return formatNumber(d) + " " + units; },
				color = d3.scaleOrdinal(d3.schemeCategory20);

			// append the svg object to the body of the page
			var svg = svg.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			// Set the sankey diagram properties
			var sankey = d3.sankey()
				.nodeWidth(36)
				.nodePadding(40)
				.size([width, height]);

			var path = sankey.link();

			// load the data
			var graph = this.data;
			sankey.nodes(graph.nodes)
				.links(graph.links)
				.layout(32);

			// add in the links
			var link = svg.append("g").selectAll(".link")
				.data(graph.links)
				.enter().append("path")
				.attr("class", "link")
				.attr("d", path)
				.style("stroke-width", function(d) { return Math.max(1, d.dy); })
				.sort(function(a, b) { return b.dy - a.dy; });

			// add the link titles
			link.append("title")
				.text(function(d) {
					return d.source.name + " → " +
						d.target.name + "\n" + format(d.value);
				});

			// add in the nodes
			var node = svg.append("g").selectAll(".node")
				.data(graph.nodes)
				.enter().append("g")
				.attr("class", "node")
				.attr("transform", function(d) {
					return "translate(" + d.x + "," + d.y + ")";
				})
				.call(d3.drag()
				.subject(function(d) {
					return d;
				})
				.on("start", function() {
					this.parentNode.appendChild(this);
				})
				.on("drag", dragmove));

			// add the rectangles for the nodes
			node.append("rect")
				.attr("height", function(d) { return d.dy; })
				.attr("width", sankey.nodeWidth())
				.style("fill", function(d) {
					if( d.name == 'Crashed' )
						return '#d9480f';
					else if( d.name == 'Exit' )
						return 'rgb(58, 184, 130)';
					return d.color = color(d.name.replace(/ .*/, ""));
				})
				.style("stroke", function(d) {
					return d3.rgb(d.color).darker(2);
				})
				.append("title")
				.text(function(d) {
					return d.name + "\n" + format(d.value);
				});

			// add in the title for the nodes
			node.append("text")
				.attr("x", -6)
				.attr("y", function(d) {
					return d.dy / 2;
				})
				.attr("dy", ".35em")
				.attr("text-anchor", "end")
				.attr("transform", null)
				.text(function(d) {
					return d.name;
				})
				.filter(function(d) {
					return d.x < width / 2;
				})
				.attr("x", 6 + sankey.nodeWidth())
				.attr("text-anchor", "start");

			// the function for moving the nodes
			function dragmove(d) {
				d3.select(this)
					.attr("transform", "translate(" + d.x + ","
						+ (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
				sankey.relayout();
				link.attr("d", path);
			}
		}
	}
}
</script>

<style lang="css" scoped>
.one-depth-user-flow svg {
	width: 100%;
	height: 300px;
}
.node rect {
	cursor: move;
	fill-opacity: .9;
	shape-rendering: crispEdges;
}

.node text {
	pointer-events: none;
	text-shadow: 0 1px 0 #fff;
}

.link {
	fill: none;
	stroke: #000;
	stroke-opacity: .2;
}

.link:hover {
	stroke-opacity: .5;
}
</style>