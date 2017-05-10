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
			nodes: [],
			app: this.$root.app
		}
	},
	watch: {
		'app.packageName': function(v, ov) {
			this.fetchData().then(() => this.draw(this.makeOthers(this.nodes)))
		}
	},
	methods: {
		createSampleData() {
			let nodes = []
			for( let i=0; i<19; i++ ) {
				nodes.push({
					name: 'asdfasdf',
					sizeValue: Math.floor(Math.random() * 100) + 1,
					colorValue: Math.floor(Math.random() * 3) + 1,
					selected: false
				})
			}
			return nodes
		},
		fetchData() {
			return new Promise((s, f) => {
				switch( this.title.toLowerCase() ) {
					case 'location':
						$.get(`/api/statusOfLocation/${this.app.packageName}`).then((res) => {
							res = res.reverse() // 서버에서 순서가 거꾸로온다
							let max = Number.MIN_VALUE
							res.forEach((node, idx) => {
								max = node.usageCount > max ? node.usageCount : max
								node.name = node.locationCode
								let p = node.crashCount / node.usageCount
								if( p == 0 ) {
									node.colorValue = 3
								} else if( p < 0.03 ) {
									node.colorValue = 2
								} else {
									node.colorValue = 1
								}
							})
							res.forEach((node, idx) => {
								node.sizeValue = (node.usageCount / max) * 100
								this.nodes.push(node)
							})
							s()
						})
						break
					case 'device':
						$.get(`/api/statusOfDevice/${this.app.packageName}`).then((res) => {
							res = res.reverse() // 서버에서 순서가 거꾸로온다
							let max = Number.MIN_VALUE
							res.forEach((node, idx) => {
								max = node.usageCount > max ? node.usageCount : max
								node.name = node.deviceName
								let p = node.crashCount / node.usageCount
								if( p == 0 ) {
									node.colorValue = 3
								} else if( p < 0.03 ) {
									node.colorValue = 2
								} else {
									node.colorValue = 1
								}
							})
							res.forEach((node, idx) => {
								node.sizeValue = (node.usageCount / max) * 100
								this.nodes.push(node)
							})
							s()
						})
						break
					case 'os':
						$.get(`/api/statusOfOs/${this.app.packageName}`).then((res) => {
							res = res.reverse() // 서버에서 순서가 거꾸로온다
							let max = Number.MIN_VALUE
							res.forEach((node, idx) => {
								max = node.usageCount > max ? node.usageCount : max
								node.name = node.osVersion
								let p = node.crashCount / node.usageCount
								if( p == 0 ) {
									node.colorValue = 3
								} else if( p < 0.03 ) {
									node.colorValue = 2
								} else {
									node.colorValue = 1
								}
							})
							res.forEach((node, idx) => {
								node.sizeValue = (node.usageCount / max) * 100
								this.nodes.push(node)
							})
							s()
						})
						break
					case 'android':
						$.get(`/api/statusOfActivity/${this.app.packageName}`).then((res) => {
							res = res.reverse() // 서버에서 순서가 거꾸로온다
							let max = Number.MIN_VALUE
							res.forEach((node, idx) => {
								max = node.usageCount > max ? node.usageCount : max
								node.name = node.activityName
								let p = node.crashCount / node.usageCount
								if( p == 0 ) {
									node.colorValue = 3
								} else if( p < 0.03 ) {
									node.colorValue = 2
								} else {
									node.colorValue = 1
								}
							})
							res.forEach((node, idx) => {
								node.sizeValue = (node.usageCount / max) * 100
								this.nodes.push(node)
							})
							s()
						})
						break
				}
			})
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
						color = 'bad'
						break
					case 2:
						color = 'soso'
						break
					case 3:
						color = 'good'
						break
				}
				let r = sizeScale(node.sizeValue)
				let g = svg.append('g')

				g.append('circle')
					.attr('cx', cx).attr('cy', cy).attr('r', r)
					.attr('class', () => node.selected ? `node ${color} selected` : `node ${color}`)

				let name = node.name
				if( name.length > 12 ) {
					name = name.slice(0, 12) + '...'
				}
				g.append('text').attr('class', 'text')
					.attr('x', cx).attr('y', cy + 30).text(name)

				let me = this;
				g.on('click', function() {
					// if others clicked
					if( nodes.length == 10 && nodes.indexOf(node) == 9 ) {
						for( let i=9; i<me.nodes.length; i++ ) {
							me.nodes[i].selected = ! node.selected
						}
					} else {
						let n = me.nodes[nodes.indexOf(node)]
						n.selected = ! n.selected
					}
					$(this).find('circle').toggleClass('selected')
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

			for( let i=10; i<nodes.length; i++ ) {
				node.sizeValue += nodes[i].sizeValue
				node.sizeValue = node.sizeValue > 100 ? 100 : node.sizeValue
				node.colorValue += nodes[i].colorValue
				node.colorValue = node.colorValue > 3 ? 3 : node.colorValue
				node.selected = node.selected || nodes[i].selected
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
				cursor: pointer;

				&.good {
					fill: #228ae6;
				}
				&.soso {
					fill: #f59f00;
				}
				&.bad {
					fill: #d9480f;
				}
				&.selected {
					stroke: white;
					stroke-width: 3px;
				}
			}

			.text {
				fill: white;
				text-anchor: middle;
				cursor: pointer;
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
