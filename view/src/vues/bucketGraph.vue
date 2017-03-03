<template lang='pug'>
	div.bucketGraph
</template>

<script>
	module.exports = {
		mounted: function() {
			nodes = [
				{'name': 'a', 'usage': 10, 'value': 3},
				{'name': 'b', 'usage': 30, 'value': 1},
				{'name': 'c', 'usage': 100, 'value': 2},
				{'name': 'd', 'usage': 50, 'value': 4},
				{'name': 'e', 'usage': 70, 'value': 5}
			];

			links = [
				{'source': 0, 'target': 2, 'value': 1},
				{'source': 1, 'target': 2, 'value': 1},
				{'source': 3, 'target': 2, 'value': 1},
				{'source': 4, 'target': 2, 'value': 1},
			];

			var bucketGraph = $('.bucketGraph'),
				width = bucketGraph.width(),
				height = 700,
				force = d3.layout.force()
						.size([width, height])
						.charge(-120)
						.linkDistance(60),
				svg = d3.select('.bucketGraph').append('svg')
						.attr('width', width)
						.attr('height', height);			
			
			/**
			 * @param  {int}	the usage value. must be 0-100
			 * @param  {int}	something important value. should be 1-5
			 * @return {array}	calculated gradient for filling
			 */
			var grad = function(usage, val) {
				/*
				name will be like this form
				grad10-3 means 10 is usage value and 3 is important value
				 */
				var g = $('#grad' + usage + '-' + val);
				
				if( g.length > 0 ) {
					return g;
				} else {
					var color = {
						1: '#ff0000',
						2: '#ff5900',
						3: '#ffc300',
						4: '#d0ff00',
						5: '#00ff7f'
					}

					g = svg.append("defs").append("linearGradient").attr("id", "grad" + usage + '-' + val)
						.attr("x1", "0%").attr("x2", "0%").attr("y1", "100%").attr("y2", "0%");
					g.append("stop").attr("offset", usage + '%').style("stop-color", color[val]);
					g.append("stop").attr("offset", (100 - usage) + '%').style("stop-color", "white");

					return g;
				}
			}

			var link = svg.selectAll(".link"),
			    node = svg.selectAll(".node");

			var color = d3.scale.category20();

			force.nodes(nodes).links(links).start();

			var drag = force.drag().on("dragstart", dragstart);

			link = link.data(links)
				    .enter().append("line")
				    .attr("class", "link");

			  node = node.data(nodes)
						    .enter().append("circle")
							.attr("class", "node")
							.attr("r", 14)
							.on("dblclick", dblclick)
							.attr('fill', function(d) { return 'url(#' + grad(d.usage, d.value).attr('id') + ')' })
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
				d3.select(this).classed('fixed', false);
			}

			function dragstart(d) {
				d3.select(this).classed('fixed', true);
			}
			force.on('tick', tick);
		}
	};
</script>

<style lang='sass'>
@import "../layout/style.scss";

.bucketGraph {
	width: 100%;
	height: 700px;

	* {
		width: 100%;
	}

	.link {
	  stroke: red;
	  stroke-width: 1.5px;
	}

	.node {
	  cursor: move;
	  stroke: #000;
	  stroke-width: 1.5px;
	}

	.node.fixed {
	  
	}
}
</style>