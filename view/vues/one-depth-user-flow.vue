<template lang="pug">
div.one-depth-user-flow
	svg
</template>

<script>
module.exports = {
	props: ['crashEventPath'],
	data: function() {
		return {
			data:{
			},
			nodes: [],
			links: [],
			app: this.$root.app
		};
	},
	watch: {
		'app.packageName'() {
			if( ! this.app.isInitDone ) {
				return
			}
			this.fetch()
		},
		'app.isInitDone'() {
			if( ! this.app.isInitDone ) {
				return
			}
			this.fetch()
		}
	},
	methods: {
		fetch() {
			if( this.crashEventPath !== undefined ) {
				this.$http.get(`/api/crashEventPath/${this.app.packageName}/${this.app.crashId}`, {params: this.app.getFilters()}).then(res => {
					let data = res.body
					this.nodes = []
					this.links = []
					this.sampling({class_name: 'crash', method_name: '', line_num: '', children: data.children}, 0)
					this.draw()
				})
			} else {
				$.get(`/api/one-depth-userflow/${this.app.packageName}/${this.app.activityName}`, this.app.getFilters()).then((res) => {
					this.nodes = []
					this.links = []
					if( ! res instanceof Object ) {
						return
					}
					if( ! res.hasOwnProperty('crash') ) {
						res.crash = 0
					}
					if( ! res.hasOwnProperty('exit') ) {
						res.exit = 0
					}

					let arr = []
					Object.keys(res).forEach(name => {
						arr.push({
							name: name,
							value: parseInt(res[name])
						})
					})

					arr = arr.sort((a, b) => a.value > b.value ? -1 : 1)
					arr = arr.splice(0, 5)

					let isExit = false
					let isCrash = false
					arr.forEach(d => {
						if( d.name == 'exit' ) {
							isExit = true
						} else if( d.name == 'crash' ) {
							isCrash = true
						}
					})
					// 0 value exit, crash node don't need to be shown
					if( ! isExit && res.exit > 0 ) {
						arr.push({
							name: 'exit',
							value: res.exit
						})
					}
					if( ! isCrash && res.crash > 0 ) {
						arr.push({
							name: 'crash',
							value: res.crash
						})
					}

					this.nodes = [{name: this.app.activityName}]
					this.links = []
					arr.forEach(d => {
						if( d.value == 0 ) {
							return
						}
						this.nodes.push({name: d.name})
						this.links.push({
							source: 0,
							target: this.nodes.length - 1,
							value: d.value
						})
					})

					this.data = {nodes: this.nodes, links: this.links}
					this.clear()
					this.draw()
				})
			}
		},
		sampling(node, parentIndex) {
			let nodes = this.nodes
			let links = this.links
			// first put myself
			nodes.push({name: `${node.class_name}.${node.method_name}:${node.line_num}`})
			let myIndex = nodes.length - 1
			// if this is root node, no link
			if( myIndex > 0 ) {
				links.push({source: parentIndex, target: myIndex, value: node.count})
			}
			if( node.children instanceof Array && node.children.length > 0 ) {
				for( let child of node.children ) {
					this.sampling(child, myIndex)
				}
			}
		},
		clear() {
			$(this.$el).find('svg *').remove()
		},
		draw: function() {
			let data = {nodes: this.nodes, links: this.links}
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
			var graph = data
			sankey.nodes(graph.nodes)
				.links(graph.links)
				.layout(32);

			let tooltip = d3.select('body')
				.append('div')
				.attr('class', 'tooltip2')
				.style('opacity', 0)

			// add in the links
			var link = svg.append("g").selectAll(".link")
				.data(graph.links)
				.enter().append("path")
				.attr("class", "link")
				.attr("d", path)
				.style("stroke-width", function(d) { return Math.max(1, d.dy); })
				.sort(function(a, b) { return b.dy - a.dy; })
				.on('mouseover', (d) => {
					tooltip.transition()
						.duration(200)
						.style('opacity', .9)
					tooltip.html(`${d.source.name} -> ${d.target.name} (${d.value})`)
						.style('left', `${d3.event.pageX}px`)
						.style('top', `${d3.event.pageY}px`)
				})
				.on('mouseout', () => {
					tooltip.transition()
						.duration(500)
						.style('opacity', 0)
				})

			// add the link titles
			// link.append("text")
			// 	.text(function(d) {
			// 		return d.source.name + " → " +
			// 			d.target.name + "\n" + format(d.value);
			// 	})

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
				.on("drag", dragmove))
				// .on('mouseover', (d) => {
				// 	tooltip.transition()
				// 		.duration(200)
				// 		.style('opacity', .9)
				// 	tooltip.html(`${d.name}`)
				// 		.style('left', `${d3.event.pageX}px`)
				// 		.style('top', `${d3.event.pageY}px`)
				// })
				// .on('mouseout', () => {
				// 	tooltip.transition()
				// 		.duration(500)
				// 		.style('opacity', 0)
				// })

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
			if( this.crashEventPath === undefined ) {
				node.append("text")
				.attr("x", -6)
				.attr("y", function(d) {
					return d.dy / 2;
				})
				.attr("dy", ".35em")
				.attr('fill', 'black')
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
			}

			// the function for moving the nodes
			function dragmove(d) {
				d3.select(this)
					.attr("transform", "translate(" + d.x + ","
						+ (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
				sankey.relayout();
				link.attr("d", path);
			}
		},
		mounted() {

		}
	}
}
</script>

<style lang="sass">
.one-depth-user-flow {
	svg {
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
		// text-shadow: 0 1px 0 #fff;
	}

	.link {
		fill: none;
		stroke: #000;
		stroke-opacity: .2;
	}

	.link:hover {
		stroke-opacity: .5;
	}
}

div.tooltip2 {
	position: absolute;
	text-align: center;
	padding: 2px;
	font: 12px sans-serif;
	background-color: black !important;
	color: white !important;
	border: 0px;
	border-radius: 8px;
	pointer-events: none;
	z-index: 9999;
}
</style>