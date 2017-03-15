	<template lang='pug'>
		div.bucketGraph
			button(@click="prevData") prev {{rawDataIndex - 1}}
			span Raw Data Index {{rawDataIndex}}
			button(@click="nextData") next {{rawDataIndex + 1}}
			br
			span or just type the index
			input(v-model.number="rawDataIndex" type="text")
			button(@click="draw") go
			br
			span Bucket Graph Mode : {{mode}}
			button(@click="changeMode(1)") MODE 1
			button(@click="changeMode(2)") MODE 2
			button(@click="changeMode(3)") MODE 3
			br
			svg
	</template>

	<script>
		module.exports = {
			mounted: function() {
				/**
				 * set raw data index as latest one
				 */
				var me = this;
				$.get('/testCnt', function(data) {
					me.rawDataIndex = data.count - 1;
					me.rawDataIndexMax = data.count - 1;
					me.draw();
				});
			},
			data: function() {
				return {
					rawDataIndex: 43,
					mode: 1,
					rawDataIndexMax: 0
				};
			},
			methods: {
				onClick: function(e) {
					this.draw();
				},
				random: function(min, max) {
					return Math.floor(Math.random() * (max - min + 1) + min);
				},
				createNodes: function(maxCount) {
					var nodes = [];
					var max = this.random(0, maxCount);

					for( var i=0; i<max; i++ ) {
						// nodes.push({'name': 'UnnamedActivity', 'usage': random(0, 100), 'value': random(1, 3)});
						nodes.push({'name': 'UnnamedActivity', 'usage': 100, 'value': this.random(1, 3)});
					}

					return nodes;
				},
				createLinks: function(nodes) {
					var links = [];
					var max = nodes.length + 1;

					for( var i=0; i<max; i++ ) {
						links.push({'source': i % nodes.length, 'target': this.random(0, nodes.length - 1), 'value': 1});
					}

					return links;
				},
				draw: function() {
					var rawDataIndex = this.rawDataIndex;
					var mode = this.mode;

					/**
					 * clear svg
					 */
					$('.bucketGraph > svg').empty();

					var nodes = this.createNodes(60);
					var links = this.createLinks(nodes);
					// links = [];

					/**
					 * random function scope
					 */
					var random = this.random;

					var bucketGraph = $('.bucketGraph'),
					width = bucketGraph.width(),
					height = 700,
					force = d3.layout.force()
							.size([width, height])
							.charge(-200)
							.linkDistance(180),
					svg = d3.select('.bucketGraph > svg')

					/**
					 * create node and link relation from server's raw data set
					 */
					d3.json('/test/' + rawDataIndex, function(err, data) {
						data = data.data

						nodes = []
						links = []
						usage = {}

						$.each(data, function(i, dump) {
							if( dump.type == 'render' ) {
								if( dump.lifecycle_name == 'onResumed' ) {
									if( usage.hasOwnProperty(dump.activity_name) ) {
										usage[dump.activity_name].value++;
									} else {
										usage[dump.activity_name] = {value: 1};
									}
								}
							} else if( dump.type == 'res' ) {
								var stack = dump.app.activity_stack;
								$.each(stack, function(i, activityName) {
									var dup = false;
									$.each(nodes, function(i, node) {
										if( node.name == activityName )
											dup = true;
									});

									if( ! dup )
										nodes.push({'name': activityName, 'usage': 100, 'value': random(3, 3)});

									// link connect
									if( i > 0 ) {
										var sourceActivityName = stack[i - 1];
										var destActivityName = activityName;
										var sourceNode, destNode;
										$.each(nodes, function(i, node) {
											if( node.name == sourceActivityName )
												sourceNode = node;
											else if( node.name == destActivityName )
												destNode = node;
										});
										if( sourceNode && destNode ) {
											var sourceIndex = nodes.indexOf(sourceNode),
												destIndex = nodes.indexOf(destNode);
											var dup = false;
											$.each(links, function(i, link) {
												if( ! dup && link.source == sourceIndex && link.target == destIndex )
													dup = true;
											});
											if( ! dup )
												links.push({'source': nodes.indexOf(sourceNode), 'target': nodes.indexOf(destNode), 'value': 1});
										}
									}
								});
							}
						});

						// usage max
						var usageMax = 0;
						$.each(usage, function(name, obj) {
							value = obj.value;
							if( value > usageMax )
								usageMax = value;
						});

						// usage allocation
						$.each(usage, function(name, obj) {
							$.each(nodes, function(i, node) {
								if( node.name == name ) {
									value = obj.value;
									node.usage = (value / usageMax) * 100;
								}
							});
						});

						// node value setting
						$.each(nodes, function(i, node) {
							if( mode == 1 ) {
								node.value = 3;
							} else {
								node.value = 3;
							}
						});

						// debug
						console.log(nodes);	

						// node position init
						var n = nodes.length;
						nodes.forEach(function(d, i) {
							d.x = d.y = width / n * i;
						});

						force.nodes(nodes).links(links).start();
					
						// 노드 갯수 표시
						var statusText = svg.append('text').text(nodes.length + '개(간선 ' + links.length + '개)').attr('x', 0).attr('y', 15);
						// $(statusText[0]).attr('@click', 'draw');

						/**
						 * @param  {int}	the usage value. must be 0-100
						 * @param  {int}	something important value. should be 1-4
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
									1: '#F80000',
									2: '#FFD652',
									3: '#77CF63'
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

						var drag = force.drag().on("dragstart", dragstart);

						link = link.data(links)
							    .enter().append("line")
							    .attr("class", "link");

					  	node = node.data(nodes)
								    .enter().append("circle")
									.attr("class", "node")
									.attr('r', function(d) { 
										if( mode == 1 ) 
											return 15; 
										else
											return 30 * (d.usage / 100);
									})
									.on("dblclick", dblclick)
									.attr('fill', function(d) { 
										if( mode == 1 )
											return 'url(#'  + grad(d.usage, d.value).attr('id') + ')' ;
										else
											return 'url(#' + grad(100, d.value).attr('id') + ')';
									})

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
						for( var i=0; i<50; i++ ) {
							force.tick();
						}

						window.force = force;
					});
				},
				prevData: function() {
					if( this.rawDataIndex > 0 ) {
						this.rawDataIndex--;
						this.draw();
					}
				},
				nextData: function() {
					if( this.rawDataIndex < this.rawDataIndexMax ) {
						this.rawDataIndex++;
						this.draw();
					}
				},
				changeMode: function(m) {
					this.mode = m;
					this.draw();
				}
			}
		};
	</script>

	<style lang='sass'>
	@import "../layout/style.scss";

	.bucketGraph {
		width: 100%;
		height: 700px;

		svg {
			width: 100%;
			height: 100%;
		}

		.link {
		  stroke: rgb(220, 220, 220);
		  stroke-width: 1.5px;
		}

		.node {
		  cursor: move;
		  stroke: #000;
		  stroke-width: 1px;
		}

		.node.fixed {
		  
		}

		.text {
			/*display: none;*/
			background-color: white;
			font-size: 9px;
		}
	}
	</style>