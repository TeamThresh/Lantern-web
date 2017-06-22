<template lang="pug">
div.dist-graph
	resize-observer(@notify='handleResize')
	svg
</template>

<script>
module.exports = {
	props: ['type', 'selectable', 'initData', 'stopWatchIsInitDone', 'stopWatchPackageName', 'fixedWidth', 'fixedHeight',
		'footnote'
	],
	data: function() {
		return {
			data: [],
			app: this.$root.app,
			fetchUrl: '',
			linkUrl: '',
			timeFormat: '',
			xScale: undefined,
			yScale: undefined,
			sampled: []
		};
	},
	watch: {
		'app.packageName'() {
			if( ! this.app.isInitDone ) {
				return
			}
			if( this.stopWatchPackageName !== undefined ) {
				return
			}
			this.fetch()
		},
		'app.isInitDone'() {
			if( ! this.app.isInitDone ) {
				return
			}
			if( this.stopWatchIsInitDone !== undefined ) {
				return
			}
			this.fetch()
		},
		data() {
			if( ! this.app.isInitDone ) {
				return
			}
			this.draw()
		},
		initData() {
			if( ! this.app.isInitDone ) {
				return
			}
			this.data = this.initData
		}
	},
	methods: {
		fetch() {
			$.get(`/api/${this.fetchUrl}/${this.app.packageName}/${this.app.activityName}`, this.app.getFilters()).then(res => {
				this.clear()
				this.data = []
				res.forEach(d => {
					this.data.push({
						date: moment(d.timestamp).valueOf(),
						value: d.value
					})
				})
			})
		},
		clear() {
			$(this.$el).find('svg *').remove()
		},
		getColor: function(value) {
			var color = {
				0: '#fff',
				1: 'rgb(144, 196, 242)',
				2: 'rgb(88, 166, 235)',
				3: 'rgb(46, 144, 230)'
			};
			return color[value];
		},
		sampling() {
			let xScale = this.xScale
			let yScale = this.yScale
			let data = this.data

			let countSumByX = {}
			this.data.forEach(d => {
				d.x = xScale(d.date)
				d.y = yScale(d.value)
				countSumByX[d.x] ? countSumByX[d.x] + d.value : countSumByX[d.x] = d.value
			})

			this.sampled = []
			this.data.forEach(d => {
				let found = false
				this.sampled.forEach(sample => {
					if( sample.x == d.x && sample.y == d.y ) {
						sample.count += d.value
						found = true
					}
				})
				if( ! found ) {
					this.sampled.push({
						x: d.x,
						y: d.y,
						count: d.value
					})
				}
			})
			this.sampled.forEach(sample => {
				let p = sample.count / countSumByX[sample.x]
				if( p >= 0.15 ) {
					sample.color = this.getColor(3)
				} else if( p >= 0.05 ) {
					sample.color = this.getColor(2)
				} else {
					sample.color = this.getColor(1)
				}
			})
		},
		draw: function() {
			this.clear()

			var me = this;
			var range = this.app.getRange()
			if( this.app.distSelection.startRange != 0 ) {
				range = {
					startRange: this.app.distSelection.startRange,
					endRange: this.app.distSelection.endRange
				}
			}
			var svg = d3.select(me.$el).select('svg');
			let width = this.fixedWidth || $(svg.node()).width()
			let height = this.fixedHeight || $(svg.node()).height()
			var axesPadding = 25;
			height -= axesPadding;
			width -= axesPadding;
			var boxPadding = 2;
			let boxWidth = 32
			var boxHeight = 8;

			// calculate timeformat by the gap of y min and max
			let delta = moment(range.endRange) - moment(range.startRange)
			if( delta <= moment.duration(1, 'd') ) {
				this.timeFormat = '%H:%M'
			} else if( delta <= moment.duration(1, 'y') ) {
				this.timeFormat = '%m-%d'
			} else {
				this.timeFormat = '%Y-%m'
			}

			let xScale = this.xScale = d3.scaleQuantize()
				.domain([range.startRange, range.endRange])
				.range((() => {
					let arr = []
					for( let i = axesPadding; i < width; i += boxWidth ) {
						arr.push(i)
					}
					return arr
				})())
			let yScale = this.yScale = d3.scaleQuantize()
				.domain((() => {
					let arr = [0]
					arr.push(Math.max.apply(Math, this.data.map(d => d.value)))
					if( arr[1] < 100 ) {
						arr[1] = 100
					}
					return arr
				})())
				.range((() => {
					let arr = []
					for( let i = height; i > 0; i -= boxHeight ) {
						arr.push(i)
					}
					return arr
				})())

			me.sampling()
			let data = me.sampled

			// axis
			var xAxis = d3.axisBottom(d3.scaleLinear().domain(xScale.domain()).range([axesPadding, width + axesPadding]))
				.tickFormat(d3.timeFormat(this.timeFormat))
				.ticks(xScale.range().length / 4)
				.tickPadding(0);
			svg.append('g')
				.attr('class', 'x-axis')
				.attr('transform', 'translate(' + ((boxWidth / 2) + (boxPadding / 2)) + ', ' + (height + 5) + ')')
				.call(xAxis);
			var yAxis = d3.axisLeft(yScale)
				.ticks(2)
				.tickPadding(0)
				.tickSize(0);
			svg.append('g')
				.attr('class', 'y-axis')
				.attr('transform', 'translate(' + axesPadding + ', ' + ((boxHeight / 2) + 5) + ')')
				.call(yAxis);

			// guide line
			let guideGroup = svg.append('g').attr('class', 'guide-group');
			guideGroup.selectAll('line')
				.data(svg.select('g.x-axis').selectAll('text').nodes()).enter().append('line')
				.attr('x1', (d) => $(d).position().left - $(d).parent().parent().parent().position().left + 10)
				.attr('x2', (d) => $(d).position().left - $(d).parent().parent().parent().position().left + 10)
				.attr('y1', (d) => $(d).position().top - $(d).parent().parent().parent().position().top - 7)
				.attr('y2', 10)
				.attr('stroke-dasharray', '5, 5')
				.attr('class', 'guide');
			guideGroup.append('line').attr('class', 'guide')
				.attr('x1', xScale(range.startRange)).attr('x2', xScale(range.endRange) + boxWidth)
				.attr('y1', yScale(0) + boxHeight).attr('y2', yScale(0) + boxHeight);
			guideGroup.append('line').attr('class', 'guide')
				.attr('x1', xScale(range.startRange)).attr('x2', xScale(range.endRange) + boxWidth)
				.attr('y1', yScale(yScale.domain()[1] / 2) + boxHeight).attr('y2', yScale(yScale.domain()[1] / 2) + boxHeight);
			guideGroup.append('line').attr('class', 'guide')
				.attr('x1', xScale(range.startRange)).attr('x2', xScale(range.endRange) + boxWidth)
				.attr('y1', yScale(yScale.domain()[1])).attr('y2', yScale(yScale.domain()[1]));

			// tooltip
			let tooltip = d3.select('body')
				.append('div')
				.attr('class', 'tooltip2')
				.style('opacity', 0)

			let boxes = []
			$.each(data, function(index, data) {
				boxes.push(svg.append('rect')
					.attr('width', boxWidth)
					.attr('height', boxHeight)
					.attr('x', data.x)
					.attr('y', data.y)
					.attr('fill', data.color)
					.attr('class', 'box')
					.on('mouseover', () => {
						tooltip.transition()
							.duration(200)
							.style('opacity', .9)
						tooltip.html(`${data.count !== undefined ? data.count : ''}<br/>
							${Math.floor(yScale.invertExtent(data.y)[0])}% ~ ${Math.floor(yScale.invertExtent(data.y)[1])}%<br/>
							${moment(xScale.invertExtent(data.x)[0]).format('YYYY-MM-DD HH:mm:ss')}<br/>
							~<br/>
							${moment(xScale.invertExtent(data.x)[1]).format('YYYY-MM-DD HH:mm:ss')}`)
							.style('left', `${d3.event.pageX}px`)
							.style('top', `${d3.event.pageY}px`)
					})
					.on('mouseout', () => {
						tooltip.transition()
							.duration(500)
							.style('opacity', 0)
					}))

				svg.append('text')
					.attr('x', data.x)
					.attr('y', data.y + 8)
					.attr('fill', '#000')
					.attr('font-size', '10px')
					.text(data.value)
					.style('display', 'none');
			});

			// drag
			if( this.selectable ) {
				let selectBox = svg.append('rect').attr('class', 'select-box').attr('fill-opacity', 0)
				svg.call(d3.drag().on('start', () => {
					selectBox.attr('x', d3.event.x)
					selectBox.attr('y', d3.event.y)
					selectBox.attr('width', 1)
					selectBox.attr('height', 1)
					selectBox.attr('fill-opacity', 0.125)
					boxes.forEach(box => box.classed('selected', false))
				}).on('drag', () => {
					let a = d3.event.subject
					let b = d3.event
					if( b.x > a.x ) {
						selectBox.attr('width', b.x - a.x)
						selectBox.attr('x', a.x)
					} else if( b.x < a.x ) {
						selectBox.attr('width', a.x - b.x)
						selectBox.attr('x', b.x)
					}
					if( b.y > a.y ) {
						selectBox.attr('height', b.y - a.y)
						selectBox.attr('y', a.y)
					} else if( b.y < a.y ) {
						selectBox.attr('height', a.y - b.y)
						selectBox.attr('y', b.y)
					}
				}).on('end', () => {
					selectBox.attr('fill-opacity', 0)
					let a = d3.event.subject
					let b = d3.event
					let x1 = a.x < b.x ? a.x : b.x
					let x2 = a.x < b.x ? b.x : a.x
					let y1 = a.y < b.y ? a.y : b.y
					let y2 = a.y < b.y ? b.y : a.y
					let minUsage = 101, maxUsage = -1
					let minRange = range.endRange, maxRange = range.startRange
					let flag = false
					boxes.forEach(box => {
						let x = parseInt(box.attr('x')) + boxWidth / 2
						let y = parseInt(box.attr('y')) + boxHeight / 2
						if( x1 < x && x < x2 && y1 < y && y < y2 ) {
							flag = true
							box.classed('selected', true)
							let usage = yScale.invertExtent(parseFloat(box.attr('y')))
							let range = xScale.invertExtent(parseFloat(box.attr('x')))
							minUsage = Math.min(minUsage, usage[0])
							maxUsage = Math.max(maxUsage, usage[1])
							minRange = Math.min(minRange, range[0])
							maxRange = Math.max(maxRange, range[1])
						}
					})
					// nothing selected
					if( ! flag ) {
						this.app.distSelection.startUsage = 0
						this.app.distSelection.endUsage = 100
						this.app.distSelection.startRange = range.startRange
						this.app.distSelection.endRange = range.endRange
						return
					}
					minUsage = Math.floor(minUsage)
					maxUsage = Math.floor(maxUsage)
					minRange = Math.floor(minRange)
					maxRange = Math.floor(maxRange)
					this.app.distSelection.startUsage = minUsage
					this.app.distSelection.endUsage = maxUsage
					this.app.distSelection.startRange = minRange
					this.app.distSelection.endRange = maxRange
				}))
			}

			// footnote
			if( this.footnote !== undefined ) {
				svg.append('text')
					.text(this.footnote)
					.attr('text-anchor', 'end')
					.attr('x', width)
					.attr('y', 15)
					.attr('font-size', '15px')
					.attr('fill', 'black')
			}
		},
		handleResize() {
			// this.draw()
		}
	},
	mounted: function() {
		// basic setting according to its type
		switch( this.type ) {
			case 'rendering':
				this.fetchUrl = 'rendering'
				this.footnote = 'unit : ms'
				break
			case 'cpu':
				this.fetchUrl = 'cpu'
				this.footnote = 'unit : percentage'
				break
			case 'memory':
				this.fetchUrl = 'memory'
				this.footnote = 'unit : MB'
				break
		}
		// init data accept
		if( this.initData !== undefined ) {
			this.data = this.initData
		}
	}
}
</script>

<style lang="sass">
.dist-graph {
	svg {
		width: 100%;
		height: 300px;
		// border: 1px solid red; // for debug
		.box {
			shape-rendering: crispEdges;
			stroke: white;
			stroke-width: 1px;

			&.selected {
				stroke: chartreuse;
				stroke-width: 2px;
			}
		}
		.x-axis, .y-axis {
			.domain {
				display: none;
			}
			.tick {
				line {
					display: none;
				}
				text {
					fill: #868e96;
				}
			}
		}
		.guide-group line {
			stroke: #ddd;
		}
	}
}

div.tooltip2 {
	position: absolute;
	text-align: center;
	// width: 100px;
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
