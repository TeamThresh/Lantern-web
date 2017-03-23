<template lang='pug'>
    <div class="activity-map">
        <div class="note note-info">
            <span>type the package name</span>
            <input type="text" v-model="packageName" style="width: 400px;"/>
            <button class="btn btn-outline dark sbold" @click="draw">search this package</button>
        </div>
        <div class="note note-info">
            <span>all package names</span>
            <br/>
            <button class="btn btn-outline dark sbold" v-for="name in packageNames" @click="packageName = name; draw();"> {{name}} </button>
        </div>
        <div class="note note-info">
            <span>Bucket Graph Mode : {{mode}}</span>
            <br/>
            <button class="btn btn-outline dark sbold" v-for="i in [1,2,3]" @click="changeMode(i);"> mode {{i}} </button>
        </div>
        <div class="note note-warning">
            <span>status : {{status}}</span>
        </div>
        <svg></svg>
    </div>
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
                mode: 1,
                rawData: [],
                packageName: 'com.andromeda.adring',
                fetchedPackageName: '',
                status: '-',
                packageNames: []
            };
        },
        methods: {
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
                var mode = this.mode;
                var random = this.random;

                var activityMap = $('.activity-map');
                var width = 1000;
                var height = 700;
                var force = d3.layout.force()
                                .size([width, height])
                                .charge(-3000)
                                .linkDistance(180);
                var svg = d3.select('.activity-map > svg');
                var nodes = [];
                var links = [];

                var me = this;

                var work = function(err, data) {
                    if( data instanceof Array )
                        data = data[0];

                    me.rawData = data;
                    me.fetchedPackageName = me.packageName;

                    nodes = data.nodes;
                    links = data.links;

                    // usage max
                    var usageMax = 0;
                    nodes.forEach(function(n) {
                        if( n.usage > usageMax )
                            usageMax = n.usage;
                    });
                    // usage to be percentage
                    // and crash to be value
                    nodes.forEach(function(n) {
                        var crashPercentage = n.crashCount / n.usage;
                        if( crashPercentage == 0 )
                            n.value = 3;
                        else if( crashPercentage < 3 )
                            n.value = 2;
                        else
                            n.value = 1;
                        n.usageCount = n.usage;
                        n.usage = n.usage / usageMax * 100;
                    });

                    /**
                     * clear svg
                     */
                    svg.selectAll('*').remove();
                    
                    console.log(nodes); 

                    // node position init
                    var n = nodes.length;
                    nodes.forEach(function(d, i) {
                        d.x = d.y = width / n * i;
                    });

                    force.nodes(nodes).links(links).start();
                
                    // 노드 갯수 표시
                    me.status += ' 성공! ' + nodes.length + '개(간선 ' + links.length + '개)';

                    /**
                     * @param  {int}    the usage value. must be 0-100
                     * @param  {int}    something important value. should be 1-4
                     * @return {array}  calculated gradient for filling
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
                            if( mode == 2 ) {
                                color = {
                                    1: '#F80000',
                                    2: '#F80000',
                                    3: '#F80000'
                                }
                                usage = val;
                                val = 1;
                            } else if( mode == 3 ) {
                                usage = 100;
                            }

                            g = svg.append("defs").append("linearGradient").attr("id", "grad" + usage + '-' + val)
                                .attr("x1", "0%").attr("x2", "0%").attr("y1", "100%").attr("y2", "0%");
                            g.append("stop").attr("offset", usage + '%').style("stop-color", color[val]);
                            g.append('stop').attr('offset', (usage) + '%').style('stop-color', 'white');
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
                                        return 15 + (15 * (d.usage / 100));
                                })
                                .attr('width', function(d) {
                                    if( mode == 1 )
                                        return 30;
                                    else
                                        return 15 + (40 * (d.usage / 100));
                                })
                                .attr('height', function(d) {
                                    if( mode == 1 )
                                        return 30;
                                    else
                                        return 15 + (40 * (d.usage / 100));
                                })
                                .on("dblclick", dblclick)
                                .attr('fill', function(d) { 
                                    if( mode == 1 )
                                        return 'url(#'  + grad(d.usage, d.value).attr('id') + ')' ;
                                    else
                                        return 'url(#' + grad(100, d.value).attr('id') + ')';
                                })
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
                            .attr("cy", function(d) { return d.y; })
                            .attr('x', function(d) { return d.x; })
                            .attr('y', function(d) { return d.y; });

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
                    for( var i=0; i<40; i++ ) {
                        force.tick();
                    }

                    window.force = force;
                };

                /**
                 * check already fetched data
                 */
                if( me.fetchedPackageName != me.packageName ) {
                    me.status = me.packageName + '의 정보 가져오는 중...';
                    d3.json('/getPackageData/' + me.packageName, work);
                } else {
                    work(null, me.rawData);
                }               
                
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

.activity-map {
    width: 100%;

    svg {
        width: 100%;
        height: 700px;
        background-color: white;
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