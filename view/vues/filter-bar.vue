<template lang="pug">
div.filter-bar
	div.menu
		select.selectpicker
			option Today
			option 3 Days
			option 7 Days
			option 2 Weeks
			option 4 Weeks
			option 1 Month
			option 3 Months
		a.type-filter.btn.grey-mint.active
			| Crash
			i.icon-wrench
		a.type-filter.btn.grey-mint
			| Resource
			i.icon-layers
		a.type-filter.btn.grey-mint
			| Network
			i.icon-feed
	div.layer
		div.header
			i.fa.fa-android
			div Android
			div.see-all-btn See All
		div.content
			svg
	div.layer
		div.header
			i.fa.fa-android
			div Android
			div.see-all-btn See All
		div.content
			svg
</template>

<script>
module.exports = {
	methods: {
		drawTest() {
			let svg = d3.select(this.$el).select('svg')

			for( let i=0; i<20; i++ ) {
				svg.append('circle').attr('class', 'node good')
					.attr('cx', 10).attr('cy', 20 + i * 10).attr('r', '5')
			}
		}
	},
	mounted() {
		$(this.$el).find('.selectpicker').selectpicker({
			style: 'btn',
			size: 4
		})

		this.drawTest()
	}
}
</script>

<style lang="sass">
div.filter-bar {
	border-radius: 5px !important;
	background-color: #2e3139;

	div.menu {
		padding: 10px 10px 10px 10px;

		div.bootstrap-select {
			width: 80px !important;

			button {
				border: 1px solid #787878;
				border-radius: 2px !important;
				background-color: #2e3139;
				color: white;
			}
		}

		a.type-filter {
			width: 103px !important;
			height: 30px !important;
			text-align: left;
			border-radius: 3px !important;
			font-size: 13px;
			&:not(:first-child) {
				margin: 0 0 0 10px;
			}
			&.active {
				background-color: #4e5fc4 !important;
				border-color: #4e5fc4 !important;
			}
			& > i {
				float: right;
				vertical-align: middle;
				line-height: inherit;
			}
		}
	}

	div.layer {
		height: 121px;
		display: flex;

		&:not(:first-child) {
			margin: 10px 0 0 0;
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
			}
		}

		div.content {
			margin: 0 0 0 2px;
			width: 100%;
			height: 100%;
			// display: inline-block;
			background-color: #23252d;

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
			}
		}
	}
}
</style>
