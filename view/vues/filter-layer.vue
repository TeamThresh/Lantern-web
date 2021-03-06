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
			app: this.$root.app,
			nodes: [],
			expanded: false,
			nameLimit: 8
		}
	},
	watch: {
		'app.packageName': function(v, ov) {
			if( ! this.app.isInitDone ) {
				return
			}
			this.fetchData().then(() => this.draw(this.makeOthers(this.nodes)))
		},
		'app.filters': {
			handler: function(v, ov) {
				if( ! this.app.isInitDone ) {
					return
				}
				this.fetchData().then(() => {
					let filters = this.app.filters[this.title.toLowerCase()]
					// select mark
					this.nodes.forEach((node) => {
						node.selected = filters.indexOf(node.name) > -1
					})
					this.clear()
					this.draw(this.expanded ? this.nodes : this.makeOthers(this.nodes))
				})
			},
			deep: true
		},
		'app.valueType': function(v, ov) {
			if( ! this.app.isInitDone ) {
				return
			}
			this.clear()
			this.draw(this.expanded ? this.nodes : this.makeOthers(this.nodes))
		},
		'app.isInitDone'() {
			if( ! this.app.isInitDone ) {
				return
			}
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
		filterUpdate() {
			let filters = this.app.filters[this.title.toLowerCase()]
			this.nodes.forEach((node) => {
				if( node.selected && filters.indexOf(node.name) < 0 ) {
					filters.push(node.name)
				} else if( ! node.selected && filters.indexOf(node.name) > -1 ) {
					filters.splice(filters.indexOf(node.name), 1)
				}
			})
		},
		fetchData() {
			return new Promise((s, f) => {
				let query = this.app.getFilters()

				// nodes clear
				this.nodes = []
				switch( this.title.toLowerCase() ) {
					case 'location':
						$.get(`/api/statusOfLocation/${this.app.packageName}`, query).then((res) => {
							res = res.reverse() // 서버에서 순서가 거꾸로온다
							let max = Number.MIN_VALUE
							res.forEach((node, idx) => {
								max = node.usageCount > max ? node.usageCount : max
								node.name = node.locationCode
								this.app.calculateColorValue(node)
								node.selected = false
							})
							res.forEach((node, idx) => {
								node.sizeValue = (node.usageCount / max) * 100
								this.nodes.push(node)
							})
							// saved filter check
							let filter = this.app.filters[this.title.toLowerCase()]
							this.nodes.forEach(n => {
								if( filter.indexOf(n.name) >= 0 ) {
									n.selected = true
								}
							})

							// done
							s()
						})
						break
					case 'device':
						$.get(`/api/statusOfDevice/${this.app.packageName}`, query).then((res) => {
							res = res.reverse() // 서버에서 순서가 거꾸로온다
							let max = Number.MIN_VALUE
							res.forEach((node, idx) => {
								max = node.usageCount > max ? node.usageCount : max
								node.name = node.deviceName
								this.app.calculateColorValue(node)
								node.selected = false
							})
							res.forEach((node, idx) => {
								node.sizeValue = (node.usageCount / max) * 100
								this.nodes.push(node)
							})
							// saved filter check
							let filter = this.app.filters[this.title.toLowerCase()]
							this.nodes.forEach(n => {
								if( filter.indexOf(n.name) >= 0 ) {
									n.selected = true
								}
							})

							// done
							s()
						})
						break
					case 'os':
						$.get(`/api/statusOfOs/${this.app.packageName}`, query).then((res) => {
							res = res.reverse() // 서버에서 순서가 거꾸로온다
							let max = Number.MIN_VALUE
							res.forEach((node, idx) => {
								max = node.usageCount > max ? node.usageCount : max
								node.name = node.osVersion
								this.app.calculateColorValue(node)
								node.selected = false
							})
							res.forEach((node, idx) => {
								node.sizeValue = (node.usageCount / max) * 100
								this.nodes.push(node)
							})
							// saved filter check
							let filter = this.app.filters[this.title.toLowerCase()]
							this.nodes.forEach(n => {
								if( filter.indexOf(n.name) >= 0 ) {
									n.selected = true
								}
							})

							// done
							s()
						})
						break
					case 'activity':
					case 'unity':
						$.get(`/api/statusOfActivity/${this.app.packageName}`, query).then((res) => {
							res = res.reverse() // 서버에서 순서가 거꾸로온다
							let max = Number.MIN_VALUE
							res.forEach((node, idx) => {
								max = node.usageCount > max ? node.usageCount : max
								node.name = node.activityName
								this.app.calculateColorValue(node)
								node.selected = false
							})
							res.forEach((node, idx) => {
								node.sizeValue = (node.usageCount / max) * 100
								this.nodes.push(node)
							})
							// saved filter check
							// unity temporary handling
							let title = this.title.toLowerCase()
							title == 'unity' ? title = 'activity' : 0
							let filter = this.app.filters[title]
							this.nodes.forEach(n => {
								if( filter.indexOf(n.name) >= 0 ) {
									n.selected = true
								}
							})

							// done
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
			let nodeHeight = this.expanded ? height / 4 : height / 2
			let sizeScale = d3.scaleLinear().domain([1, 100]).range([3, 15])

			nodes.forEach((node, idx) => {
				let cx = (idx % 5) * nodeWidth + nodeWidth / 2
				let cy = Math.floor(idx / 5) * nodeHeight + nodeHeight / 2 - 10
				let color = ''
				switch( node[`${this.app.valueType}ColorValue`] ) {
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
				if( name.length > this.nameLimit ) {
					name = name.slice(0, this.nameLimit) + '...'
				}
				g.append('text').attr('class', 'text')
					.attr('x', cx).attr('y', cy + 30).text(name)

				let me = this;
				g.on('click', function() {
					// others clicked
					if( nodes.length == 10 && nodes.indexOf(node) == 9 ) {
						// others should check its selection explicitly
						let selected = $(this).find('circle').hasClass('selected')
						for( let i=9; i<me.nodes.length; i++ ) {
							me.nodes[i].selected = ! selected
						}
					} else {
						let n = me.nodes[nodes.indexOf(node)]
						n.selected = ! n.selected
					}

					$(this).find('circle').toggleClass('selected')

					me.filterUpdate()
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
			this.expanded = ! isExpanded

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

			this.clear()
			if( ! isExpanded ) {
				this.draw(this.nodes)
			} else {
				this.draw(this.makeOthers(this.nodes))
			}
		}
	},
	mounted() {
		// fetch
		if( this.app.isInitDone ) {
			this.fetchData().then(() => this.draw(this.makeOthers(this.nodes)))
		}
	}
}
</script>

<style lang="sass">
div.layer {
	margin: 0 0 10px 0;
	height: 121px;
	display: flex;

	&.unity {
		.header {
			background-color: white;
			color: black;

			img {
				width: 40px;
			}
		}
	}

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
