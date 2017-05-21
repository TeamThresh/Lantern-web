<template lang="pug">
div.pie-graph
	svg
</template>

<script>
export default {
	props: ['type'],
	data() {
		return {
			app: this.$root.app,
			data: []
		}
	},
	watch: {
		'app.packageName'() {
			this.fetch()
		}
	},
	methods: {
		fetch() {
			new Promise((s, f) => {
				this.data = []
				switch( this.type ) {
					case 'crashVersionOs':
						this.$http.get(`/api/crashVersion/${this.app.packageName}/${this.app.crashId}/os`).then(res => {
							this.data = res.body.map(d => {
								return {label: d.os_ver, value: d.crash_count}
							})
							s()
						})
						break
					case 'crashVersionApp':
						this.$http.get(`/api/crashVersion/${this.app.packageName}/${this.app.crashId}/app`).then(res => {
							this.data = res.body.map(d => {
								return {label: d.app_ver, value: d.crash_count}
							})
							s()
						})
						break
					case 'crashVersionDevice':
						this.$http.get(`/api/crashVersion/${this.app.packageName}/${this.app.crashId}/device`).then(res => {
							this.data = res.body.map(d => {
								return {label: d.device_name, value: d.crash_count}
							})
							s()
						})
						break
					case 'crashVersionLocation':
						this.$http.get(`/api/crashVersion/${this.app.packageName}/${this.app.crashId}/location`).then(res => {
							this.data = res.body.map(d => {
								return {label: d.location_code, value: d.crash_count}
							})
							s()
						})
						break
				}
			}).then(() => {
				Morris.Donut({
					element: $(this.$el).find('svg'),
					data: this.data
				})
			})
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
