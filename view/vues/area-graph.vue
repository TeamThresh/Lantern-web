<template lang="pug">
div.area-graph
	svg
</template>

<script>
module.exports = {
	props: ['type'],
	data() {
		return {
			app: this.$root.app,
			data: [],
			xScale: d3.scaleTime(),
			yScale: d3.scaleLinear(),
			margin: {top: 10, right: 0, bottom: 20, left: 30},
			timeFormat: ''
		}
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
			new Promise((s, f) => {
				switch( this.type ) {
					case 'crashUsage':
						this.$http.get(`/api/crashUsage/${this.app.packageName}`, {params: this.app.getFilters()}).then(res => {
							let data = res.body
							this.data = data.map(d => {
								return {x: d.collect_time, y: d.count}
							})
							s()
						})
						break
				}
			}).then(() => {
				let range = this.app.getRange()

				this.xScale = this.xScale.domain([range.startRange, range.endRange]).range([this.margin.left, $(this.$el).find('svg').width() - this.margin.right])

				// timeformat
				let delta = moment(range.endRange) - moment(range.startRange)
				if( delta <= moment.duration(2, 'd') ) {
					this.timeFormat = '%H:%M'
				} else if( delta <= moment.duration(1, 'y') ) {
					this.timeFormat = '%m-%d'
				} else {
					this.timeFormat = '%Y-%m'
				}

				let newData = []
				this.data.forEach(d => {
					let x = Math.floor(this.xScale(d.x))
					let merged = false

					newData.forEach(n => {
						if( ! merged && Math.floor(this.xScale(n.x)) == x ) {
							merged = true
							n.y += d.y
						}
					})

					if( ! merged ) {
						newData.push({x: d.x, y: d.y})
					}
				})
				this.data = newData.sort((a, b) => a.x > b.x)

				let maxCount = Math.max.apply(Math, this.data.map(d => d.y))

				this.yScale = this.yScale.domain([0, maxCount]).range([$(this.$el).find('svg').height() - this.margin.bottom, this.margin.top])

				this.draw()
			})
		},
		clear() {
			$(this.$el).find('svg *').remove()
		},
		draw() {
			let svg = d3.select(this.$el).select('svg')
			let width = $(svg.node()).width()
			let height = $(svg.node()).height()
			let range = this.app.getRange()
			let margin = this.margin
			let xScale = this.xScale
			let yScale = this.yScale
			let xAxis = d3.axisBottom(this.xScale).ticks(4).tickSize(0).tickFormat(d3.timeFormat(this.timeFormat))
			let yAxis = d3.axisLeft(this.yScale).ticks(2).tickSize(0)

			this.clear()

			this.app.drawAxis(svg, xAxis, yAxis, margin)

			let area = d3.area()
			.x(d => xScale(d.x)).y0(d => height - this.margin.bottom).y1(d => yScale(d.y))
			svg.append('path').data([this.data]).attr('d', area).attr('fill', 'rgba(247, 103, 7, 0.62)')

			let line = d3.line()
			.x((d) => xScale(d.x)).y(d => yScale(d.y));
			svg.append('path').data([this.data]).attr('d', line).attr('stroke', '#d9480f').attr('fill', 'none').attr('stroke-width', '2px');

			let tooltip = d3.select('body')
				.append('div')
				.attr('class', 'tooltip2')
				.style('opacity', 0)

			let dots = svg.selectAll('circle')
				.data(this.data)
				.enter()
				.append('circle')
				.attr('class', 'dot')
				.attr('cx', (d) => xScale(d.x))
				.attr('cy', (d) => yScale(d.y))
				.attr('r', '3px')
				.attr('fill', '#e66735')
				.on('mouseover', (d) => {
					tooltip.transition()
						.duration(200)
						.style('opacity', .9)
					tooltip.html(`${d.y}<br/>(${moment(d.date).format('YYYY-MM-DD HH:mm:ss')})`)
						.style('left', `${d3.event.pageX}px`)
						.style('top', `${d3.event.pageY}px`)
				})
				.on('mouseout', () => {
					tooltip.transition()
						.duration(500)
						.style('opacity', 0)
				})
		},
		fakeFetch() {
			let range = this.app.getRange()
			this.xScale = this.xScale.domain([range.startRange, range.endRange]).range([this.margin.left, $(this.$el).find('svg').width() - this.margin.right])
			this.yScale = this.yScale.domain([0, 1000]).range([$(this.$el).find('svg').height() - this.margin.bottom, this.margin.top])

			// timeformat
			let date = this.app.getRange()
			let delta = moment(date.endRange) - moment(date.startRange)
			if( delta <= moment.duration(2, 'd') ) {
				this.timeFormat = '%H:%M'
			} else if( delta <= moment.duration(1, 'y') ) {
				this.timeFormat = '%m-%d'
			} else {
				this.timeFormat = '%Y-%m'
			}

			for( let m=moment(range.startRange); m<moment(range.endRange); m.add(4, 'h') ) {
				let x = Math.floor(this.xScale(m.valueOf()))
				let value = Math.floor(Math.random() * 700) + 300
				let merged = false

				this.data.forEach(d => {
					if( d.x == x && ! merged ) {
						merged = true
						d.value += value
					}
				})

				if( ! merged ) {
					this.data.push({x, value})
				}
			}

			this.draw()
		}
	},
	mounted() {
	}
}
</script>

<style lang="sass">
	.area-graph {
		width: 100%;
		height: 300px;

		svg {
			width: 100%;
			height: 300px;

			path.domain {
				display: none;
			}

			g.y-axis {
				text {
					// text-anchor: ;
				}
			}

			g.tick text {
				fill: #868e96;
			}

			line.guide {
				stroke: #3e3e3e;
			}
		}
	}

div.tooltip2 {
	position: absolute;
	text-align: center;
	width: 100px;
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
