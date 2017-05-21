<template lang="pug">
div.area-graph
	svg
</template>

<script>
module.exports = {
	props: [],
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
		'app.packageName': 'fetch'
	},
	methods: {
		fetch() {
			this.fakeFetch()
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

			let line = d3.line()
				.x((d) => d.x).y(d => yScale(d.value));
			svg.append('path').data([this.data]).attr('d', line).attr('stroke', '#69db7c').attr('fill', 'none');

			let area = d3.area()
				.x(d => d.x).y0(d => height - this.margin.bottom).y1(d => yScale(d.value))
			svg.append('path').data([this.data]).attr('d', area).attr('fill', '#69c07c')
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
		},
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
</style>
