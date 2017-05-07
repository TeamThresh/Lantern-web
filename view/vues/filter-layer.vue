<template lang="pug">
div.layer
	div.header
		slot(name='icon')
		div {{ title }}
		div.see-all-btn(@click='seeAll($event)')
			i.fa.fa-chevron-down
	div.content
		svg
	div.dim.hidden
</template>

<script>
module.exports = {
	props: ['title'],
	data() {
		return {
			nodes: []
		}
	},
	methods: {
		createSampleData() {
			this.nodes = []
			for( let i=0; i<19; i++ ) {
				this.nodes.push({
					name: 'asdfasdf',
					sizeValue: Math.floor(Math.random() * 100) + 1,
					colorValue: Math.floor(Math.random() * 3) + 1
				})
			}
		},
		drawTest() {
			let svg = d3.select(this.$el).select('svg')
			let width = $(svg.node()).width()
			let height = $(svg.node()).height()
			let nodeWidth = width / 5
			let nodeHeight = height / 2
			let sizeScale = d3.scaleLinear().domain([1, 100]).range([3, 15])

			this.createSampleData()

			this.nodes.forEach((node, idx) => {
				let cx = (idx % 5) * nodeWidth + nodeWidth / 2
				let cy = Math.floor(idx / 5) * nodeHeight + nodeHeight / 2 - 10
				let color = ''
				switch( node.colorValue ) {
					case 1:
						color = 'good'
						break
					case 2:
						color = 'soso'
						break
					case 3:
						color = 'bad'
						break
				}
				let r = sizeScale(node.sizeValue)
				svg.append('circle').attr('class', `node ${color}`)
					.attr('cx', cx).attr('cy', cy).attr('r', r)
				svg.append('text').attr('class', 'text')
					.attr('x', cx).attr('y', cy + 30).text(node.name)
			})
		},
		seeAll(e) {
			let isExpanded = $(this.$el).find('.content').hasClass('expanded')

			$('div.layer').toArray().forEach((div, idx) => {
				let content = $(div).find('.content')
				let dim = $(div).find('.dim')
				let btn = $(div).find('.see-all-btn')
				let btnIcon = $(btn).find('i')

				if( isExpanded ) {
					content.removeClass('expanded')
					dim.addClass('hidden')
					btn.removeClass('active')
					btnIcon.removeClass('fa-chevron-up').addClass('fa-chevron-down')
				} else if( div == this.$el ) {
					content.addClass('expanded')
					dim.addClass('hidden')
					btn.addClass('active')
					btnIcon.addClass('fa-chevron-up').removeClass('fa-chevron-down')
				} else {
					content.removeClass('expanded')
					dim.removeClass('hidden')
					btn.removeClass('active')
					btnIcon.removeClass('fa-chevron-up').addClass('fa-chevron-down')
				}
			})
		}
	},
	mounted() {
		this.drawTest()
	}
}
</script>

<style lang="sass">
div.layer {
	margin: 0 0 10px 0;
	height: 121px;
	display: flex;

	div.header {
		width: 70px;
		height: 100%;
		flex: none;
		// display: inline-block;
		background-color: #23252d;
		text-align: center;
		color: white;

		i {
			margin: 33px 0 5px 0;
			font-size: 20px;
			color: white;
			vertical-align: middle;
		}

		.see-all-btn {
			border: 1px solid #787878;
			margin: 28px auto 0 auto;
			width: 60px;
			background-color: #2e3139;
			color: #eee;
			font-size: 11px;
			text-align: center;

			&.active {
				background-color: #4e5fc4;
			}

			i {
				margin: 0 0 0 0;
				font-size: 11px;
			}
		}
	}

	div.content {
		margin: 0 0 0 2px;
		width: 100%;
		height: 100%;
		// display: inline-block;
		background-color: #23252d;

		&.expanded {
			height: 200%;
			position: relative;
			z-index: 950903;
		}

		svg {
			width: 100%;
			height: 100%;

			.node {
				&.good {
					fill: #228ae6;
				}
				&.soso {
					fill: #f59f00;
				}
				&.bad {
					fill: #d9480f;
				}
			}

			.text {
				fill: white;
				text-anchor: middle;
			}
		}
	}

	div.dim {
		width: 95%;
		height: 121px;
		position: absolute;
		z-index: 950902;
		background-color: rgba(0, 0, 0, 0.75);

		&.hidden {
			display: none;
		}
	}
}
</style>
