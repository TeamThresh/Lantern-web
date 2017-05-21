<template lang="pug">
div.pie-graph
	svg
</template>

<script>
export default {
	props: [],
	data() {
		return {
			app: this.$root.app
		}
	},
	watch: {

	},
	methods: {
		fetch() {
			
		},
		clear() {
			$(this.$el).select('svg *').remove()
		},
		draw() {

		}
	},
	mounted() {

	}
}
</script>

<style lang="sass">
</style>
