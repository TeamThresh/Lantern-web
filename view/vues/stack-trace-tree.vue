<template lang="pug">
div.panel-group.accordion#callStackAccordion
	div.panel.panel-default
		div.panel-heading
			div.panel-title
				a.accordion-toggle(href='#thread1' data-toggle='collapse') thread1
		div.panel-collapse.collapse#thread1
			div.panel-body
				h1 thread1
				div.jstree.jstree-default.jstree-1
	div.panel.panel-default
		div.panel-heading
			div.panel-title
				a.accordion-toggle(href='#thread2' data-toggle='collapse') thread2
		div.panel-collapse.collapse#thread2
			div.panel-body
				h1 thread2
</template>

<script>
module.exports = {
	props: [],
	data() {
		return {
			app: this.$root.app,
			data: [
				{text: 'Zygote', type: 'android', children: [
					{text: 'Method.handler', type: 'android'},
					{text: 'DB Access', type: 'db'}
				]},
				{text: 'Lantern.collect()', type: 'android', children: [
					{text: 'connectToServer()', type:'network'}
				]}
			]
		}
	},
	watch: {

	},
	methods: {

	},
	mounted() {
		$(this.$el).find('.jstree-1').jstree({
			core: {
				themes: {
					variant: 'large'
				},
				data: this.data
			},
			types: {
				default: {
					icon: 'fa fa-window-maximize'
				},
				android: {
					icon: 'fa fa-android'
				},
				db: {
					icon: 'fa fa-database'
				},
				network: {
					icon: 'fa fa-exchange'
				}
			},
			plugins: ['wholerow', 'types']
		})
	}
}
</script>

<style lang="sass">
</style>
