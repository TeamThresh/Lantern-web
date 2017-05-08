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
	filter-layer(title='Android')
		i.fa.fa-android(slot='icon')
	filter-layer(title='OS')
		i.fa.fa-terminal(slot='icon')
	filter-layer(title='Device')
		i.fa.fa-mobile(slot='icon')
	filter-layer(title='Location')
		i.fa.fa-globe(slot='icon')
	filter-group
</template>

<script>
module.exports = {
	methods: {

	},
	mounted() {
		$(this.$el).find('.selectpicker').selectpicker({
			style: 'btn',
			size: 4
		})
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
}
</style>
