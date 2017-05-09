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
			let nodes = []
			for( let i=0; i<19; i++ ) {
				nodes.push({
					name: 'asdfasdf',
					sizeValue: Math.floor(Math.random() * 100) + 1,
					colorValue: Math.floor(Math.random() * 3) + 1
				})
			}
			return nodes
		},
		draw(nodes) {
			let svg = d3.select(this.$el).select('svg')
			let width = $(svg.node()).width()
			let height = $(svg.node()).height()
			let nodeWidth = width / 5
			let nodeHeight = height / 2
			let sizeScale = d3.scaleLinear().domain([1, 100]).range([3, 15])

			nodes.forEach((node, idx) => {
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
				let g = svg.append('g')
				g.append('circle').attr('class', `node ${color}`)
					.attr('cx', cx).attr('cy', cy).attr('r', r)
				g.append('text').attr('class', 'text')
					.attr('x', cx).attr('y', cy + 30).text(node.name)
				g.on('click', function() {
					console.log(node)
				})
			})
		},
		clear() {
			let svg = d3.select(this.$el).select('svg')
			svg.selectAll('*').remove()
		},
		makeOthers(nodes) {
			if( nodes.length <= 10 ) {
				return nodes
			}

			// for deep copy
			let nodes2 = JSON.parse(JSON.stringify(nodes))
			nodes2 = nodes2.slice(0, 10)
			let node = nodes2[9]
			node.name = 'Others'

			for( let i=10; i<nodes2.length; i++ ) {
				node.sizeValue += nodes2[i].sizeValue
				node.colorValue += nodes2[i].colorValue
				node.sizeValue = node.sizeValue > 100 ? 100 : node.sizeValue
				node.colorValue = node.colorValue > 3 ? 3 : node.colorValue
			}
			nodes2[9] = node
			return nodes2
		},
		seeAll(e) {
			let isExpanded = $(this.$el).find('.content').hasClass('expanded')

			if( ! isExpanded ) {
				this.clear()
				this.draw(this.nodes)
			}

			$('div.layer').toArray().forEach((div, idx) => {
				let content = $(div).find('.content')
				let dim = $(div).find('.dim')
				let svg = $(div).find('svg')
				let btn = $(div).find('.see-all-btn')
				let btnIcon = $(btn).find('i')

				if( isExpanded ) {
					content.removeClass('expanded')
					dim.addClass('hidden')
					svg.removeClass('expanded')
					btn.removeClass('active')
					btnIcon.removeClass('fa-chevron-up').addClass('fa-chevron-down')
				} else {
					if( div == this.$el ) {
						content.addClass('expanded')
						dim.addClass('hidden')
						svg.addClass('expanded')
						btn.addClass('active')
						btnIcon.addClass('fa-chevron-up').removeClass('fa-chevron-down')
					} else {
						content.removeClass('expanded')
						dim.removeClass('hidden')
						svg.removeClass('expanded')
						btn.removeClass('active')
						btnIcon.removeClass('fa-chevron-up').addClass('fa-chevron-down')
					}
				}
			})

			// svg가 좁아진 이후에 그려야한다. 자동으로 height width를 계산하기 때문
			if( isExpanded ) {
				this.clear()
				this.draw(this.makeOthers(this.nodes))
			}
		}
	},
	mounted() {
		this.nodes = this.createSampleData()
		this.draw(this.makeOthers(this.nodes))
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
			overflow-y: scroll;
		}

		svg {
			width: 100%;
			height: 100%;

			&.expanded {
				height: 240px;
			}

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
