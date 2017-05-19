<template lang="pug">
div.m-grid.m-grid-row(style='height: 50px;')
	div.m-grid-col.m-grid-col-xs-6.m-grid-col-middle.font-white.left
		i.fa.fa-dropbox
		span {{app.packageName}}
		i.fa.fa-chevron-right
	div.m-grid-col.m-grid-col-xs-6.m-grid-col-middle.font-white.right
		i.fa.fa-bar-chart(style='margin: 0 5px 0 0')
		span 2.79.9
		i.fa.fa-chevron-down
</template>

<script>
module.exports = {
	data() {
		return {
			app: this.$root.app
		}
	}
}
</script>

<style lang="sass" scoped>
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
</style>
