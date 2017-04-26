<template lang="pug">
div.line-graph
</template>

<script>
module.exports = {
	data: function() {
		return {
			data: []
		};
	},
	methods: {
		draw: function() {
			this.data = this.createSampleData();

			let svg = d3.select(this.$el).append('svg');
			let width = $(svg.node()).width();
			let height = $(svg.node()).height();
			let xScale = d3.scaleTime().domain([this.data[0].date, this.data[this.data.length - 1].date]).range([23, width - 10]);
			let yScale = d3.scaleLinear().domain([0, 100]).range([height - 15, 10]);
			let xAxis = d3.axisBottom(xScale).ticks(4).tickSize(0).tickFormat(d3.timeFormat('%H:%M'));
			let yAxis = d3.axisLeft(yScale).ticks(1).tickSize(0);
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
				.attr('x1', xScale(this.data[0].date)).attr('x2', xScale(this.data[this.data.length - 1].date))
				.attr('y1', yScale(0)).attr('y2', yScale(0));
			guideGroup.append('line').attr('class', 'guide')
				.attr('x1', xScale(this.data[0].date)).attr('x2', xScale(this.data[this.data.length - 1].date))
				.attr('y1', yScale(50)).attr('y2', yScale(50));
			guideGroup.append('line').attr('class', 'guide')
				.attr('x1', xScale(this.data[0].date)).attr('x2', xScale(this.data[this.data.length - 1].date))
				.attr('y1', yScale(100)).attr('y2', yScale(100));

			let line = d3.line().curve(d3.curveCatmullRom.alpha(1))
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
		this.draw();
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
