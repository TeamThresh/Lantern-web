<template lang="pug">
div.line-graph
	svg
</template>

<script>
module.exports = {
	props: ['initData'],
	data: function() {
		return {
			app: this.$root.app,
			data: [],
			x: {
				min: moment(8640000000000000)._d,
				max: moment(0)._d
			},
			y: {
				min: Number.MAX_VALUE,
				max: Number.MIN_VALUE
			},
			timeFormat: ''
		};
	},
	watch: {
		initData: function() {
			this.data = this.initData
			// empty
			if( this.data.length == 0 ) {
				let range = this.app.getRange()
				this.data = [{
					date: range.startRange,
					value: 0
				}, {
					date: range.endRange,
					value: 0
				}]
			}

			// update data's min, max of each x, y
			this.x.min = this.data[0].date
			this.x.max = this.data[this.data.length - 1].date
			this.data.forEach(d => {
				this.y.min = d.value < this.y.min ? d.value : this.y.min
				this.y.max = d.value > this.y.max ? d.value : this.y.max
			})

			// calculate timeformat by the gap of y min and max
			let delta = moment(this.y.max) - moment(this.y.min)
			if( delta <= moment.duration(1, 'd') ) {
				this.timeFormat = '%H:%M'
			} else if( delta <= moment.duration(1, 'y') ) {
				this.timeFormat = '%m-%d'
			} else {
				this.timeFormat = '%Y-%m'
			}
			this.draw()
		}
	},
	methods: {
		draw: function() {
			let svg = d3.select(this.$el).select('svg');
			let width = $(svg.node()).width();
			let height = $(svg.node()).height();
			let xScale = d3.scaleTime().domain([this.x.min, this.x.max]).range([23, width - 10]);
			let yScale = d3.scaleLinear().domain([0, this.y.max]).range([height - 15, 10]);
			let xAxis = d3.axisBottom(xScale).ticks(4).tickSize(0).tickFormat(d3.timeFormat(this.timeFormat));
			let yAxis = d3.axisLeft(yScale).ticks(2).tickSize(0);

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
				.attr('x1', xScale(this.x.min)).attr('x2', xScale(this.x.max))
				.attr('y1', yScale(0)).attr('y2', yScale(0));
			guideGroup.append('line').attr('class', 'guide')
				.attr('x1', xScale(this.x.min)).attr('x2', xScale(this.x.max))
				.attr('y1', yScale(this.y.max / 2)).attr('y2', yScale(this.y.max / 2));
			guideGroup.append('line').attr('class', 'guide')
				.attr('x1', xScale(this.x.min)).attr('x2', xScale(this.x.max))
				.attr('y1', yScale(this.y.max)).attr('y2', yScale(this.y.max));

			let line = d3.line()
				.x((d) => xScale(d.date)).y((d) => yScale(d.value));
			svg.append('path').data([this.data]).attr('d', line).attr('stroke', '#69db7c').attr('fill', 'none');
		},
		createSampleData() {
			var data = [];
			var now = moment();
			for( var m = now.clone().subtract(1, 'd'); m.isBefore(now); m.add(1, 'h') ) {
				data.push({
					date: m.clone()._d,
					value: Math.round(Math.random() * 100)
				});
			}
			return data;
		}
	},
	mounted: function() {
	}
}
</script>

<style lang="sass">
.line-graph {
	width: 100%;
	height: 150px;

	svg {
		width: 100%;
		height: 150px;

		path.domain {
			display: none;
		}

		g.y-axis {
			text {
				// text-anchor: ;
			}
		}

		g.tick text {
			fill: white;
		}

		line.guide {
			stroke: #3e3e3e;
		}
	}
}
</style>
