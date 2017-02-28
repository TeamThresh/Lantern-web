<template lang='pug'>
	div.bucketGraph
</template>

<script>
	module.exports = {
		mounted: function() {
			nodes = [
				{'x': 0, 'y': 0},
				{'x': 0, 'y': 0},
				{'x': 0, 'y': 0},
				{'x': 0, 'y': 0},
				{'x': 0, 'y': 0}
			];

			links = [
				{'source': 0, 'target': 2},
				{'source': 1, 'target': 2},
				{'source': 3, 'target': 2},
				{'source': 4, 'target': 2}
			];

			var bucketGraph = $('.bucketGraph'),
				width = bucketGraph.width(),
				height = 700,
				force = d3.layout.force()
						.size([width, height])
						.charge(400)
						.linkDistance(40)
						.on('tick', tick),
				svg = d3.select('.bucketGraph').append('svg')
						.attr('width', width)
						.attr('height', height);

			
			
			var link = svg.selectAll(".link"),
			    node = svg.selectAll(".node");

			force.nodes(nodes).links(links).start();
			var drag = force.drag().on("dragstart", dragstart);

			link = link.data(links)
				    .enter().append("line")
				      .attr("class", "link");

			  node = node.data(nodes)
			    .enter().append("circle")
			      .attr("class", "node")
			      .attr("r", 12)
			      .on("dblclick", dblclick)
			      .call(drag); 



			function tick() {
				link.attr("x1", function(d) { return d.source.x; })
					.attr("y1", function(d) { return d.source.y; })
					.attr("x2", function(d) { return d.target.x; })
					.attr("y2", function(d) { return d.target.y; });

				node.attr("cx", function(d) { return d.x; })
					.attr("cy", function(d) { return d.y; });
			}


			function dblclick(d) {
			  d3.select(this).classed("fixed", d.fixed = false);
			}

			function dragstart(d) {
			  d3.select(this).classed("fixed", d.fixed = true);
			}
		}
	};
</script>

<style lang='sass' scoped>
@import "../layout/style.scss";

.bucketGraph {
	width: 100%;
	height: 700px;

	* {
		width: 100%;
	}

	.link {
	  stroke: #000;
	  stroke-width: 1.5px;
	}

	.node {
	  cursor: move;
	  fill: #ccc;
	  stroke: #000;
	  stroke-width: 1.5px;
	}

	.node.fixed {
	  fill: #f00;
	}
}
</style>