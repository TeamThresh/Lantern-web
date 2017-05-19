<template lang="pug">
div.dist-graph
	svg
</template>

<script>
module.exports = {
	props: ['type'],
	data: function() {
		return {
			data: [],
			app: this.$root.app,
			fetchUrl: '',
			linkUrl: '',
			timeFormat: ''
		};
	},
	watch: {
		'app.packageName'() {
			this.fetch()
		}
	},
	methods: {
		fetch() {
			$.get(`/api/${this.fetchUrl}/${this.app.packageName}/${this.app.activityName}${this.app.getFilterQuery()}`).then(res => {
				this.clear()
				this.data = []
				res.forEach(d => {
					this.data.push({
						date: moment(d.timestamp),
						value: d.value
					})
				})

				// calculate timeformat by the gap of y min and max
				let range = this.app.getRange()
				let delta = moment(range.endRange) - moment(range.startRange)
				if( delta <= moment.duration(1, 'd') ) {
					this.timeFormat = '%H:%M'
				} else if( delta <= moment.duration(1, 'y') ) {
					this.timeFormat = '%m-%d'
				} else {
					this.timeFormat = '%Y-%m'
				}

				this.draw()
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
		getRandom: function(min, max) {
			if( ! max ) {
				max = min;
				min = 0;
			}
			return Math.floor(min + (Math.random() * (max - min + 1)));
		},
		getRandomSapleData: function(dateMin, dateMax) {
			var me = this;
			var data = [];
			var Datum = function(date, value) { // datum constructor
				return {
					date: date,
					value: value
				};
			};
			for( var m = moment(dateMin); m.isBefore(dateMax); m.add(1, 'minutes') ) {
				// bottom area
				if( me.getRandom(100) > 0 ) {
					data.push(new Datum(moment(m), me.getRandom(0, 5)));
				}
				if( me.getRandom(100) > 90 ) {
					data.push(new Datum(moment(m), me.getRandom(5, 15)));
				}
				if( me.getRandom(100) > 95 ) {
					data.push(new Datum(moment(m), me.getRandom(15, 20)));
				}
				// middle area
				if( me.getRandom(100) > 97 ) {
					data.push(new Datum(moment(m), me.getRandom(21, 40)));
				}
				// top area
				if( me.getRandom(100) > 99 ) {
					data.push(new Datum(moment(m), me.getRandom(40, 100)));
				}
			}
			return data;
		},
		sampling: function(data, xScale, yScale) {
			var me = this;
			var Box = function(x, y, value) { // box constructor
				return {
					x: x,
					y: y,
					value: value
				}
			};
			var boxes = [];
			var boxCountByX = {};
			// x and y scaled box generate
			$.each(data, function(index, d) {
				var x = xScale(d.date);
				var y = yScale(d.value);
				boxCountByX[x] ? boxCountByX[x]++ : boxCountByX[x] = 1;
				for( var i = 0; i < boxes.length; i++ ) {
					if( boxes[i].x == x && boxes[i].y == y ) {
						boxes[i].value++;
						return;
					}
				}
				boxes.push(new Box(x, y, 1));
			});
			// color
			$.each(boxes, function(index, box) {
				var value = box.value / boxCountByX[box.x];
				if( value >= 0.05 )
					box.color = me.getColor(3);
				else if( value >= 0.03 )
					box.color = me.getColor(2);
				else
					box.color = me.getColor(1);
			});
			return boxes;
		},
		draw: function() {
			var me = this;
			var range = this.app.getRange()
			var svg = d3.select(me.$el).select('svg');
			var width = $(svg.node()).width();
			var height = $(svg.node()).height();
			var axesPadding = 25;
			height -= axesPadding;
			width -= axesPadding;
			var boxPadding = 2;
			var boxWidth = (function() {
				var range = [32, 31, 30, 29, 28];
				var widthInt = Math.floor(width);
				var min = 2147483647;
				var minIndex = -1;
				$.each(range, function(i, boxWidth) {
					var remainder = widthInt % (boxWidth + boxPadding);
					if( remainder < min ) {
						min = remainder;
						minIndex = i	;
					}
				});
				return range[minIndex];
			})();
			var boxHeight = 8;
			var xScale = d3.scaleQuantize()
				.domain((function() {
					var date2 = range.endRange
					var date1 = range.startRange
					return [date1, date2];
				})())
				.range((function() {
					var range = [];
					for( var i = 0; i < width / (boxWidth + boxPadding); i++ ) {
						var r = width - boxWidth - (boxWidth * i) - (boxPadding * i);
						if( r < 0 )
							break;
						r += axesPadding; // for axes place
						range.push(r);
					}
					return range.reverse();
				})());
			var yScale = d3.scaleQuantize()
				.domain((function() {
					return [0, 100];
				})())
				.range((function() {
					var range = [];
					for( var i = 0; i < height / (boxHeight + boxPadding); i++ ) {
						var r = height - boxHeight - (boxHeight * i) - (boxPadding * i);
						if( r < 0 )
							break;
						range.push(r);
					}
					return range;
				})());
			var colorScale = d3.scaleQuantize()
				.domain([0, 23])
				.range([1, 2, 3]);

			// me.data = me.getRandomSapleData(xScale.domain()[0], xScale.domain()[1]);
			me.data = me.sampling(me.data, xScale, yScale);

			// axis
			var xAxis = d3.axisBottom(xScale)
				.tickFormat(d3.timeFormat(this.timeFormat))
				.ticks(xScale.range().length / 4)
				.tickPadding(0);
			svg.append('g')
				.attr('class', 'x-axis')
				.attr('transform', 'translate(' + ((boxWidth / 2) + (boxPadding / 2)) + ', ' + (height) + ')')
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
				.attr('x1', xScale(range.startRange)).attr('x2', xScale(range.endRange))
				.attr('y1', yScale(0) + boxHeight).attr('y2', yScale(0) + boxHeight);
			guideGroup.append('line').attr('class', 'guide')
				.attr('x1', xScale(range.startRange)).attr('x2', xScale(range.endRange))
				.attr('y1', yScale(50) + boxHeight).attr('y2', yScale(50) + boxHeight);
			guideGroup.append('line').attr('class', 'guide')
				.attr('x1', xScale(range.startRange)).attr('x2', xScale(range.endRange))
				.attr('y1', yScale(100)).attr('y2', yScale(100));

			let boxes = []
			$.each(me.data, function(index, data) {
				boxes.push(svg.append('rect')
					.attr('width', boxWidth)
					.attr('height', boxHeight)
					.attr('x', data.x)
					.attr('y', data.y)
					.attr('fill', data.color)
					.attr('class', 'box'))
				svg.append('text')
					.attr('x', data.x)
					.attr('y', data.y + 8)
					.attr('fill', '#000')
					.attr('font-size', '10px')
					.text(data.value)
					.style('display', 'none');
			});

			// drag
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
				boxes.forEach(box => {
					let x = parseInt(box.attr('x')) + boxWidth / 2
					let y = parseInt(box.attr('y')) + boxHeight / 2
					if( x1 < x && x < x2 && y1 < y && y < y2 ) {
						box.classed('selected', true)
						let usage = yScale.invertExtent(parseInt(box.attr('y')))
						let range = xScale.invertExtent(parseInt(box.attr('x')))
						minUsage = minUsage > usage[0] ? usage[0] : minUsage
						maxUsage = maxUsage < usage[1] ? usage[1] : maxUsage
						minRange = minRange > range[0] ? range[0] : minRange
						maxRange = maxRange < range[1] ? range[1] : maxRange
					}
				})
				minUsage = Math.floor(minUsage)
				maxUsage = Math.floor(maxUsage)
				minRange = Math.floor(minRange)
				maxRange = Math.floor(maxRange)
			}))
		}
	},
	mounted: function() {
		// basic setting according to its type
		switch( this.type ) {
			case 'rendering':
				this.fetchUrl = 'rendering'
				break
			case 'cpu':
				this.fetchUrl = 'cpu'
				break
			case 'memory':
				this.fetchUrl = 'memory'
				break
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
			&.selected {
				stroke: red;
				stroke-width: 3px;
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
</style>
