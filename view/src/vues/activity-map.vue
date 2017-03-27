<template lang='pug'>
div.activity-map
	svg
	//- div.note.note-warning
	//- 	span {{status}}
	//- div.note.note-info
	//- 	span type the package name
	//- 	input(type='text' v-model='packageName' style='width: 400px')
	//- 	button.btn.btn-outline.dark.sbold(@click='draw') search this package
	//- div.note.note-info
	//- 	span all package names
	//- 	br
	//- 	button.btn.btn-outline-dark.sbold(v-for='name in packageNames' @click='packageName = name; draw();') {{name}}
</template>

<script>
module.exports = {
    mounted: function() {
        var me = this;
        me.draw();
    },
    data: function() {
        return {
            rawData: [],
            packageName: 'com.andromeda.adring',
            fetchedPackageName: '',
            status: '-'
        };
    },
    methods: {
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
			var svg = d3.select('.activity-map > svg');

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
					$(links).each(function(idx, l) {
						l.sourceIndex = l.source;
						l.source = nodes[l.source].id;
						l.targetIndex = l.target;
						l.target = nodes[l.target].id;
					});

					// the most linked node is the center of graph
					$(links).each(function(idx, l) {
						nodes[l.sourceIndex].connectionAsSourceCount++;
						nodes[l.targetIndex].connectionAsTargetCount++;
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
						if (n.usage > usageMax)
						usageMax = n.usage;
					});
					// usage to be percentage
					// and crash to be value
					nodes.forEach(function(n) {
						var crashPercentage = n.crashCount / n.usage;
						if (crashPercentage == 0)
						n.value = 3;
						else if (crashPercentage < 3)
						n.value = 2;
						else
						n.value = 1;
						n.usageCount = n.usage;
						n.usage = n.usage / usageMax * 100;
						n.usage = Math.floor(n.usage);
					});
				} else {
					nodes = me.rawData.nodes;
					links = me.rawData.links;
				}

                // clear svg
                svg.selectAll('*').remove();

				// debug log
                console.log(me.packageName, nodes, links);

                var link = svg.selectAll(".link"),
                    node = svg.selectAll(".node"),
                    text = svg.selectAll('.text'),
                    usageText = svg.selectAll('.usageText');

                link = link.data(links)
                    .enter().append("line")
                    .attr("class", "link")
					.attr('stroke', function(d) {
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
					.on('click', function() { location.href = '/activitySummary/12345'; });

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
					.on('click', function() { location.href = '/activitySummary/12345'; });

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
                d3.json('/getPackageData/' + me.packageName, work);
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
    width: 100%;

    svg {
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
}
</style>