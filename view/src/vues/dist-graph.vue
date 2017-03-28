<template lang="pug">
div.dist-graph
	svg
</template>

<script>
module.exports = {
	data: function() {
		return {
			data: []
		};
	},
	methods: {
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
						minIndex = i;
					}
				});
				return range[minIndex];
			})();
			var boxHeight = 8;
			var xScale = d3.scaleQuantize()
				.domain((function() {
					var date2 = moment();
					var date1 = moment(date2 - moment.duration(1, 'days'));
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

			me.data = me.getRandomSapleData(xScale.domain()[0], xScale.domain()[1]);
			me.data = me.sampling(me.data, xScale, yScale);

			$.each(me.data, function(index, data) {
				svg.append('rect')
					.attr('width', boxWidth)
					.attr('height', boxHeight)
					.attr('x', data.x)
					.attr('y', data.y)
					.attr('fill', data.color);
				svg.append('text')
					.attr('x', data.x)
					.attr('y', data.y + 8)
					.attr('fill', '#000')
					.attr('font-size', '10px')
					.text(data.value)
					.style('display', 'none');
			});

			// axis
			var xAxis = d3.axisBottom(xScale)
				.tickFormat(function(d) {
					return moment(d).format('HH:mm');
				})
				.ticks(xScale.range().length / 3)
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

			// debug
			window.xScale = xScale;
		}
	},
	mounted: function() {
		this.draw();
	}
}
</script>

<style lang="sass">
.dist-graph {
	svg {
		width: 100%;
		height: 300px;
		// border: 1px solid red; // for debug
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
}
</style>
