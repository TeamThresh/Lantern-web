<template lang="pug">
div.app-status.m-grid.m-grid-row(style='height: 50px;')
	div.m-grid-col.m-grid-col-xs-6.m-grid-col-middle.font-white.left
		i.fa.fa-dropbox
		span {{app.packageName}}
		//- i.fa.fa-chevron-right
	div.m-grid-col.m-grid-col-xs-6.m-grid-col-middle.font-white.right
		div.m-grid.m-grid-row
			div.m-grid-col.m-grid-col-xs-2.m-grid-col-middle
				i.fa.fa-bar-chart(style='margin: 0 5px 0 0')
			div.m-grid-col.m-grid-col-xs-10.m-grid-col-middle
				select.selectpicker2(v-model='version')
					option(v-for='v in app.versions', :value='v') {{v}}
</template>

<script>
module.exports = {
	data() {
		return {
			app: this.$root.app,
			version: this.$root.app.filters.app
		}
	},
	watch: {
		'app.versions'() {
			setTimeout(this.selectPicker, 500) // mother fucker why v-for render lifecycle does not be specified? really sucks
		}
	},
	methods: {
		selectPicker() {
			$(this.$el).find('.selectpicker2').selectpicker({
				style: 'aaa',
				size: 4
			})
		}
	},
	mounted() {
		// this.selectPicker()
	}
}
</script>

<style lang="sass">
.app-status {
	.left {
		padding: 0 20px 0 20px;
		font-size: 14px;
		font-weight: bold;
		background-color: #007eed;
		border-top-left-radius: 5px !important;
		border-bottom-left-radius: 5px !important;

		i:first-child {
			margin: 0 5px 0 0;
			font-size: 27px;
			vertical-align: middle;
		}
		i:last-child {
			margin: 3px 0 0 0;
			float: right;
			vertical-align: middle;
		}
	}
	.right {
		padding: 0 20px 0 20px;
		font-size: 14px;
		font-weight: bold;
		background-color: #2e3139;
		border-top-right-radius: 5px !important;
		border-bottom-right-radius: 5px !important;

		i:first-child {
			margin: 0 5px 0 0;
		}
			i:last-child {
			margin: 3px 0 0 0;
			float: right;
		}
	}
	.aaa {
		border: none !important;
		background-color: transparent !important;
		color: white !important;
	}
}
</style>
