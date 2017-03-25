<template lang='pug'>
div.activity-map
	div.note.note-info
		span type the package name
		input(type='text' v-model='packageName' style='width: 400px')
		button.btn.btn-outline.dark.sbold(@click='draw') search this package
	div.note.note-info
		span all package names
		br
		button.btn.btn-outline-dark.sbold(v-for='name in packageNames' @click='packageName = name; draw();') {{name}}
	div.note.note-warning
		span {{status}}
	svg
</template>

<script>
module.exports = {
    mounted: function() {
        var me = this;
        $.get('/getAllPackageNames', function(data) {
            me.packageNames = data.packageNames;
        });

        me.draw();
    },
    data: function() {
        return {
            rawData: [],
            packageName: 'com.andromeda.adring',
            fetchedPackageName: '',
            status: '-',
            packageNames: []
        };
    },
    methods: {
        draw: function() {
            var mode = this.mode;
            var random = this.random;

            var width = $('.activity-map > svg').width();
            var height = $('.activity-map > svg').height();
            var simulation = d3.forceSimulation()
								.force('link', d3.forceLink().id(function(d) { return d.id; }).distance(function(d) { return 100 + (100 - d.target.usage) * 1.26; }))
								.force('charge', d3.forceManyBody().strength(function(d) { return -1 * d.usage * 50; }))
								.force('center', d3.forceCenter(width / 2, height / 2));
			var svg = d3.select('.activity-map > svg');
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

                me.rawData = data;
                me.fetchedPackageName = me.packageName;

                nodes = data.nodes;
                links = data.links;

				// for d3 version4 forceLayout
				// add id attribute and some preprocess
				$(nodes).each(function(idx, n) {
					n.id = n.name;
					n.group = 1;
				});
				$(links).each(function(idx, l) {
					l.source = nodes[l.source].id;
					l.target = nodes[l.target].id;
				});

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

                /**
                 * clear svg
                 */
                svg.selectAll('*').remove();

                console.log(me.packageName, nodes, links);

                // node position init
                var n = nodes.length;
                nodes.forEach(function(d, i) {
                    d.x = d.y = width / n * i;
                });

                // 노드 갯수 표시
                me.status += ' 성공! ' + nodes.length + '개(간선 ' + links.length + '개)';

                var link = svg.selectAll(".link"),
                    node = svg.selectAll(".node"),
                    text = svg.selectAll('.text'),
                    usageText = svg.selectAll('.usageText');

                link = link.data(links)
                    .enter().append("line")
                    .attr("class", "link");

                node = node.data(nodes).enter()
                    .append("circle")
                    .attr("class", "node")
                    .attr('r', function(d) {
                        var base = 13;
                        var x = 0.63;
                        return base + (x * d.usage) + 'px';
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
                    .attr('stroke-opacity', function(d) {
                        if (d.usage >= 90)
                            return 0.5;
                    });

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
                    });

                text = text.data(nodes)
                    .enter().append('text')
                    .attr('class', 'text')
                    .text(function(d) {
                        return d.name;
                    })
                    .style('text-anchor', 'middle');

				simulation.nodes(nodes).on('tick', tick);
				simulation.force('link').links(links);

                function tick() {
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

                    node.attr("cx", function(d) {
                            return d.x;
                        })
                        .attr("cy", function(d) {
                            return d.y;
                        })
                        .attr('x', function(d) {
                            return d.x;
                        })
                        .attr('y', function(d) {
                            return d.y;
                        });

                    text.attr('x', function(d) {
                            return d.x;
                        })
                        .attr('y', function(d) {
                            return d.y - (13 + 0.63 * d.usage) - 11 / 2;
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
                work(null, me.rawData);
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

    .link {
        stroke: #3f3f3f;
        stroke-width: 1.5px;
    }

    .node {
        cursor: move;
    }

    .node.fixed {}

    .text {
        /*display: none;*/
        font-size: 11px;
        fill: #fff;
    }
}
</style>