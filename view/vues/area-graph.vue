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
			let xScale = this.xScale
			let yScale = this.yScale
			let xAxis = d3.axisBottom(this.xScale).ticks(4).tickSize(0).tickFormat(d3.timeFormat(this.timeFormat));
			let yAxis = d3.axisLeft(this.yScale).ticks(2).tickSize(0);
			let minY = Number.MAX_VALUE, maxY = Number.MIN_VALUE

			this.data.forEach(d => {
				if( d.y < minY ) {
					minY = d.y
				}
				if( d.y > maxY ) {
					maxY = d.y
				}
			})

			this.clear()

			svg.append('g').attr('class', 'x-axis').attr('transform', `translate(0, ${height - 13})`).call(xAxis)
				.selectAll('line').remove();
			svg.append('g').attr('class', 'y-axis').attr('transform', `translate(20, 0)`).call(yAxis)
				.selectAll('line').remove();

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
				.attr('x1', xScale(range.startRange)).attr('x2', xScale(range.endRange))
				.attr('y1', yScale(0)).attr('y2', yScale(0));
			guideGroup.append('line').attr('class', 'guide')
				.attr('x1', xScale(range.startRange)).attr('x2', xScale(range.endRange))
				.attr('y1', yScale(maxY / 2)).attr('y2', yScale(maxY / 2));
			guideGroup.append('line').attr('class', 'guide')
				.attr('x1', xScale(range.startRange)).attr('x2', xScale(range.endRange))
				.attr('y1', yScale(maxY)).attr('y2', yScale(maxY));

			let line = d3.line()
				.x((d) => d.x).y((d) => d.y);
			svg.append('path').data([this.data]).attr('d', line).attr('stroke', '#69db7c').attr('fill', 'none');

			let area = d3.area()
				.x(d => d.x).y0(d => height).y1(d => d.y)
			svg.append('path').data([this.data]).attr('d', area).attr('fill', '#69c07c')
		},
		fakeFetch() {
			console.log('hello')
			let range = this.app.getRange()
			this.xScale = this.xScale.domain([range.startRange, range.endRange]).range([23, $(this.$el).find('svg').width() - 10])
			this.yScale = this.yScale.domain([0, 1000]).range([$(this.$el).find('svg').height(), 10])

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

			for( let m=moment(range.startRange); m<moment(range.endRange); m.add(30, 'm') ) {
				let x = Math.floor(this.xScale(m.valueOf()))
				let y = Math.floor(Math.random() * 1000)
				let merged = false

				this.data.forEach(d => {
					if( d.x == x && ! merged ) {
						merged = true
						d.y += y
					}
				})

				if( ! merged ) {
					this.data.push({
						x: x,
						y: y
					})
				}

				console.log(this.data.length)
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
