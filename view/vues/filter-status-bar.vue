<template lang="pug">
div.page-sidebar.navbar-collapse.collapsed.filter-status-bar
	ul.page-sidebar-menu.page-header-fixed.page-sidebar-menu-closed(data-keep-expanded='false', data-auto-scroll='true', data-slide-speed='200', style='padding-top: 20px')
		li.nav-item
			a.nav-link.nav-toggle
				i.fa.fa-android
				span.title Android
			ul.sub-menu
				li.nav-item(v-for='android in app.filters.android')
					a.nav-link
						i.fa.fa-circle
						span.title {{android}}
		li.nav-item
			a.nav-link.nav-toggle
				i.fa.fa-terminal
				span.title OS
			ul.sub-menu
				li.nav-item(v-for='os in app.filters.os')
					a.nav-link
						i.fa.fa-circle
						span.title {{os}}
		li.nav-item
			a.nav-link.nav-toggle
				i.fa.fa-mobile
				span.title Device
			ul.sub-menu
				li.nav-item(v-for='device in app.filters.device')
					a.nav-link
						i.fa.fa-circle
						span.title {{device}}
		li.nav-item
			a.nav-link.nav-toggle
				i.fa.fa-globe
				span.title Location
			ul.sub-menu
				li.nav-item(v-for='location in app.filters.location')
					a.nav-link
						i.fa.fa-circle
						span.title {{location}}
</template>

<script>
module.exports = {
	data() {
		return {
			app: this.$root.app
		}
	},
	watch: {
		'app.filters': {
			handler() {

			},
			deep: true
		}
	}
}
</script>

<style lang="sass">
	.filter-status-bar {
		height: 100vh;
	}
</style>
