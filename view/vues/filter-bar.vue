<template lang="pug">
div.filter-bar
	div.menu
		select.selectpicker2(v-model='app.filters.fixedRange')
			option(value=0) Today
			option(value=3) 3 Days
			option(value=7) 7 Days
			option(value=14) 2 Weeks
			option(value=28) 4 Weeks
			option(value=30) 1 Month
			option(value=90) 3 Months
			option(value=150) 5 Months
			option(value=180) 6 Months
		a.type-filter.btn.grey-mint(@click='app.valueType = "crash"', :class='{active: app.valueType == "crash"}')
			| Crash
			i.icon-wrench
		a.type-filter.btn.grey-mint(@click='app.valueType = "resource"', :class='{active: app.valueType == "resource"}')
			| Resource
			i.icon-layers
		a.type-filter.btn.grey-mint(@click='app.valueType = "network"', :class='{active: app.valueType == "network"}')
			| Network
			i.icon-feed
	filter-layer.unity(title='Unity', v-if='app.unityVisible')
		img(src='/assets/img/unity-logo.png', slot='icon')
	filter-layer(title='Activity')
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
	data() {
		return {
			app: this.$root.app
		}
	},
	watch: {
		'app.isInitDone'() {
			if( ! this.app.isInitDone ) {
				return
			}
			this.selectPicker()
		}
	},
	methods: {
		selectPicker() {
			$(this.$el).find('.selectpicker2').val(this.app.filters.fixedRange)
			$(this.$el).find('.selectpicker2').selectpicker({
				style: 'btn',
				size: 4
			})
		}
	},
	created() {
	},
	mounted() {
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
			width: 120px !important;

			button {
				border: 1px solid #787878;
				border-radius: 2px !important;
				background-color: #2e3139;
				color: white;
			}
		}

		a.type-filter {
			width: 98px !important;
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
