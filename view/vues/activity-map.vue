<template lang='pug'>
div.activity-map
	div
		a.btn.grey-mint.active
			| Crash
			i.icon-wrench
		a.btn.grey-mint
			| Resource
			i.icon-layers
		a.btn.grey-mint
			| Network
			i.icon-feed
		svg.index
	svg.map
</template>

<script>
module.exports = {
    mounted: function() {
        var me = this;
		me.drawIndex();
		$.get('/api/packageNames', function(data) {
            me.packageName = data.packageNames[0];
			me.draw();
        });
    },
    data: function() {
        return {
            rawData: [],
            packageName: '',
            fetchedPackageName: '',
            status: '-'
        };
    },
    methods: {
		drawIndex: function() {
			// index
			var svg = d3.select(this.$el).select('svg.index');
			var indexGradient = svg.append('defs')
				.append('linearGradient')
				.attr('id', 'index')
				.attr('x1', '0%').attr('x2', '100%')
				.attr('y1', '0%').attr('y2', '0%');
			indexGradient.append('stop').attr('offset', '0%').attr('stop-color', '#0086df');
			indexGradient.append('stop').attr('offset', '35%').attr('stop-color', '#5590a3');
			indexGradient.append('stop').attr('offset', '66%').attr('stop-color', '#e49f00');
			indexGradient.append('stop').attr('offset', '100%').attr('stop-color', '#ef4000');
			svg.append('rect').attr('x', 80).attr('y', 5).attr('width', 76).attr('height', 8).attr('fill', 'url(#index)');
			svg.append('text').attr('x', 80 + (76 / 2)).attr('y', 13).text('Danger').attr('font-size', 11).attr('dy', 11).attr('fill', 'white')
				.attr('text-anchor', 'middle');

			svg.append('circle').attr('cx', 15).attr('cy', 15).attr('r', 7).attr('class', 'node')
				.attr('fill', '#228ae6').attr('stroke', '#228ae6').attr('stroke-width', 3).attr('stroke-opacity', 0.5);
			svg.append('text').attr('x', 30).attr('y', 15).text('User').attr('font-size', 11).attr('dy', 5).attr('fill', 'white');
		},
        draw: function() {
            var mode = this.mode;
            var random = this.random;

            var width = $('.activity-map > svg').width();
            var height = $('.activity-map > svg').height();
            var simulation = d3.forceSimulation()
								.force('link', d3.forceLink().id(function(d) { return d.id; }))
								.force('charge', d3.forceManyBody().strength(-500))
								.force('center', d3.forceCenter(width / 2 , height / 2))
								.force('collide', d3.forceCollide().radius(function(d) { return d.r * 2; }))
								.velocityDecay(0.8);
			var svg = d3.select('.activity-map > svg.map');

			function dragstarted(d) {
	            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
	            d.fx = d.x;
	            d.fy = d.y;
	        }

	        function dragged(d) {
	            d.fx = d3.event.x;
	            d.fy = d3.event.y;
	        }

	        function dragended(d) {
	            if (!d3.event.active) simulation.alphaTarget(0);
	            d.fx = null;
	            d.fy = null;
	        }

            var nodes = [];
            var links = [];
            var color = {
                1: '#d9480f',
                2: '#f59f00',
                3: '#228ae6'
            };

            var me = this;

            var work = function(err, data) {
                if (data instanceof Array)
                    data = data[0];

				if( data ) {
					me.rawData = data;
					me.fetchedPackageName = me.packageName;
					nodes = data.nodes;
					links = data.links;
					// for d3 version4 forceLayout
					// add id attribute and some preprocess
					$(nodes).each(function(idx, n) {
						n.id = n.name;
						n.group = 1;
						n.connectionCount = 0;
						n.connectionAsSourceCount = 0;
						n.connectionAsTargetCount = 0;
					});
					// self prerequite link delete
					for( var i = 0; i < links.length; i++ ) {
						if( links[i].source == links[i].target ) {
							links.splice(i, 1);
							i--;
						}
					}
					// the most linked node is the center of graph
					$(links).each(function(idx, l) {
						$.each(nodes, function(i, n) {
							if( n.name == l.source ) {
								n.connectionAsSourceCount++;
								l.sourceIndex = i;
							} else if( n.name == l.target ) {
								n.connectionAsTargetCount++;
								l.targetIndex = i;
							}
						});
					});
					var centerNode = null;
					$(nodes).each(function(idx, n) {
						n.connectionCount = n.connectionAsSourceCount + n.connectionAsTargetCount;
						if( ! centerNode )
						centerNode = n;
						if( n.connectionCount > centerNode.connectionCount )
						centerNode = n;
					});
					centerNode.isCenterNode = true;
					// usage max
					var usageMax = 0;
					nodes.forEach(function(n) {
						if (n.usageCount > usageMax)
						usageMax = n.usageCount;
					});
					// usage to be percentage
					// and crash to be value
					nodes.forEach(function(n) {
						var crashPercentage = n.crashCount / n.usageCount;
						if (crashPercentage == 0)
							n.value = 3;
						else if (crashPercentage < 0.03)
							n.value = 2;
						else
							n.value = 1;
						n.usage = n.usageCount / usageMax * 100;
						n.usage = Math.ceil(n.usage);
					});
				} else {
					nodes = me.rawData.nodes;
					links = me.rawData.links;
				}

                // clear svg
                svg.selectAll('*').remove();

				// debug log
                console.log(me.packageName, nodes, links);

				if( nodes === undefined || nodes.length == 0 ) {
					return;
				}

                var link = svg.selectAll(".link"),
                    node = svg.selectAll(".node"),
                    text = svg.selectAll('.text'),
                    usageText = svg.selectAll('.usageText');

                link = link.data(links)
                    .enter().append("line")
                    .attr("class", "link")
					.attr('stroke', function(d) {
						if( nodes[d.targetIndex] == undefined )
							console.log(d);
						var value = Math.min(nodes[d.sourceIndex].value, nodes[d.targetIndex].value);
						if( value == 1 )
							return color[1];
						else if( value == 2 )
							return color[2];
						else
							return '#3f3f3f';
					})
					.attr('stroke-width', 1);

                node = node.data(nodes).enter()
                    .append("circle")
                    .attr("class", "node")
                    .attr('r', function(d) {
                        var base = 13;
                        var x = 0.63;

                        return (d.r = base + (x * d.usage)) + 'px';
                    })
                    .attr('fill', function(d) {
                        return color[d.value];
                    })
                    .attr('stroke', function(d) {
                        if (d.usage >= 90)
                            return color[d.value];
                    })
                    .attr('stroke-width', function(d) {
                        if (d.usage >= 90)
                            return 17;
                    })
					.call(d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended))
                    .attr('stroke-opacity', function(d) {
                        if (d.usage >= 90)
                            return 0.5;
                    })
					.style('cursor', 'pointer')
					.on('click', function(d) { location.href = '/activitySummary/' + me.packageName + '/' + d.name; });

                usageText = usageText.data(nodes).enter()
                    .append('text')
                    .attr('class', 'usage-text')
                    .attr('text-anchor', 'middle')
                    .attr('fill', '#fff')
                    .attr('font-size', function(d) {
                        return 11 + ((d.usage / 100) * 24);
                    })
                    .attr('font-weight', function(d) {
                        if (d.usage >= 90)
                            return 'bold';
                        else if (d.usage < 70)
                            return 'lighter';
                    })
                    .text(function(d) {
                        return d.usage + '%';
                    })
					.call(d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended))
					.style('cursor', 'pointer')
					.on('click', function(d) { location.href = '/activitySummary/' + me.packageName + '/' + d.name; });

                text = text.data(nodes)
                    .enter().append('text')
                    .attr('class', 'text')
                    .text(function(d) {
                        return d.name;
                    })
                    .style('text-anchor', 'middle')
					.style('font-weight', function(d) {
						if( d.isCenterNode )
							return 600;
						else
							return 300;
					})
					.attr('fill', function(d) {
						if( d.isCenterNode )
							return '#fff';
						else
							return '#ccc';
					});

				simulation.nodes(nodes).on('tick', tick);
				if( links.length > 0 )
					simulation.force('link').links(links);

                function tick() {
					if( links.length > 0 ) {
	                    link.attr("x1", function(d) {
	                            return d.source.x;
	                        })
	                        .attr("y1", function(d) {
	                            return d.source.y;
	                        })
	                        .attr("x2", function(d) {
	                            return d.target.x;
	                        })
	                        .attr("y2", function(d) {
	                            return d.target.y;
	                        })
	                        .attr('box-shadow');
					}
                    node.attr("cx", function(d) {
                            return d.x = Math.max(d.r, Math.min(width - d.r, d.x));
                        })
                        .attr("cy", function(d) {
							var padding = 10 + 11 + 17; // caption text padding, caption font-size, node border
                            return d.y = Math.max(d.r + padding, Math.min(height - d.r - padding, d.y));
                        });

                    text.attr('x', function(d) {
                            return d.x;
                        })
                        .attr('y', function(d) {
							var padding = 10;
                            return d.y - (13 + 0.63 * d.usage) - 11 / 2 - padding;
                        });

                    usageText.attr('x', function(d) { return d.x; })
                                .attr('y', function(d) {
                                    return d.y + parseInt(this.getAttribute('font-size')) / 3;
                                });
                }
            };

            /**
             * check already fetched data
             */
            if (me.fetchedPackageName != me.packageName) {
                me.status = me.packageName + '의 정보 가져오는 중...';
                d3.json('/api/getNodesAndLinks/' + me.packageName, work);
            } else {
                work();
            }

        },
        prevData: function() {
            if (this.rawDataIndex > 0) {
                this.rawDataIndex--;
                this.draw();
            }
        },
        nextData: function() {
            if (this.rawDataIndex < this.rawDataIndexMax) {
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
.activity-map {
	margin: 0;
	padding: 0;
	width: 100%;

    svg.map {
        width: 100%;
        height: 700px;
        background-color: #1b1c2e;
    }

    .node {
        cursor: move;
    }

    .node.fixed {}

    .text {
        /*display: none;*/
        font-size: 11px;
    }

	.btn {
		width: 110px;
		height: 30px;
		text-align: left;
		border-radius: 3px !important;
		font-size: 13px;
		line-height: 13px !important;

		&:not(:first-child) {
			margin: 0 0 0 10px;
		}

		&.active {
			background-color: #4e5fc4 !important;
			border-color: #4e5fc4 !important;
		}

		& > i {
			float: right;
			vertical-align: middle;
		}
	}

	svg.index {
		margin: 0 0 0 30px;
		height: 30px;
		display: inline-block;
		background-color: #1b1c2e;
		vertical-align: middle;
	}
}
</style>