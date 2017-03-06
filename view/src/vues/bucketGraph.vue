<template lang='pug'>
	div.bucketGraph
</template>

<script>
	module.exports = {
		mounted: function() {
			function random(min, max) {
				return Math.floor(Math.random() * (max - min + 1) + min);
			}

			function createNodes(maxCount) {
				var nodes = [];
				var max = random(0, maxCount);

				for( var i=0; i<max; i++ ) {
					nodes.push({'name': 'UnnamedActivity', 'usage': random(0, 100), 'value': random(1, 5)});
					console.log(random(1, 5));
				}

				return nodes;
			}

			function createLinks(nodes) {
				var links = [];
				var max = random(nodes.length, nodes.length * 2);

				for( var i=0; i<max; i++ ) {
					links.push({'source': i % nodes.length, 'target': random(0, nodes.length - 1), 'value': 1});
				}

				return links;
			}

			nodes = createNodes(20);
			links = createLinks(nodes);

			var bucketGraph = $('.bucketGraph'),
				width = bucketGraph.width(),
				height = 700,
				force = d3.layout.force()
						.size([width, height])
						.charge(-800)
						.linkDistance(150),
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
						1: '#f7472c',
						2: '#ffa23f',
						3: '#ffc300',
						4: '#d0ff00',
						5: '#22910a'
					}

					g = svg.append("defs").append("linearGradient").attr("id", "grad" + usage + '-' + val)
						.attr("x1", "0%").attr("x2", "0%").attr("y1", "100%").attr("y2", "0%");
					g.append("stop").attr("offset", usage + '%').style("stop-color", color[val]);
					g.append('stop').attr('offset', (usage + 1) + '%').style('stop-color', 'white');
					g.append("stop").attr("offset", (100 - usage) + '%').style("stop-color", "white");
					
					return g;
				}
			}

			var link = svg.selectAll(".link"),
			    node = svg.selectAll(".node"),
			    text = svg.selectAll('.text');

			var color = {
						1: '#ff0000',
						2: '#ff5900',
						3: '#ffc300',
						4: '#d0ff00',
						5: '#00ff7f'
			};

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

			text = text.data(nodes)
							.enter().append('text')
							.attr('class', 'text')
							.text(function(d) { return d.name; })
							.style('text-anchor', 'middle');


			function tick() {
				link.attr("x1", function(d) { return d.source.x; })
					.attr("y1", function(d) { return d.source.y; })
					.attr("x2", function(d) { return d.target.x; })
					.attr("y2", function(d) { return d.target.y; });

				node.attr("cx", function(d) { return d.x; })
					.attr("cy", function(d) { return d.y; });

				text.attr('x', function(d) { return d.x; })
						.attr('y', function(d) { return d.y - 20; });
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

	*/* {
		width: 100%;
	}*/

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

	.text {
		background-color: white;
		font-size: 12px;
	}
}
</style>