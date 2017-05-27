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
			if( ! this.app.isInitDone ) {
				return
			}
			this.fetch()
		},
		'app.isInitDone'() {
			if( ! this.app.isInitDone ) {
				return
			}
			this.fetch()
		}
	},
	methods: {
		fetch() {
			new Promise((s, f) => {
				this.data = []
				switch( this.type ) {
					case 'crashVersionOs':
						this.$http.get(`/api/crashVersion/${this.app.packageName}/${this.app.crashId}/os`, {params: this.app.getFilters()}).then(res => {
							this.data = res.body.map(d => {
								return {label: d.os_ver, value: d.crash_count}
							})
							s()
						})
						break
					case 'crashVersionApp':
						this.$http.get(`/api/crashVersion/${this.app.packageName}/${this.app.crashId}/app`, {params: this.app.getFilters()}).then(res => {
							this.data = res.body.map(d => {
								return {label: d.app_ver, value: d.crash_count}
							})
							s()
						})
						break
					case 'crashVersionDevice':
						this.$http.get(`/api/crashVersion/${this.app.packageName}/${this.app.crashId}/device`, {params: this.app.getFilters()}).then(res => {
							this.data = res.body.map(d => {
								return {label: d.device_name, value: d.crash_count}
							})
							s()
						})
						break
					case 'crashVersionLocation':
						this.$http.get(`/api/crashVersion/${this.app.packageName}/${this.app.crashId}/location`, {params: this.app.getFilters()}).then(res => {
							this.data = res.body.map(d => {
								return {label: d.location_code, value: d.crash_count}
							})
							s()
						})
						break
					case 'crashRank':
						this.$http.get(`/api/crashRank/${this.app.packageName}`, {params: this.app.getFilters()}).then(res => {
							this.data = res.body.map(d => {
								return {label: d.crash_rank, value: d.crash_count}
							})
							$(this.$el).height('300px')
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

<style lang="sass" scoped>
.pie-graph {
	svg {
		width: 100%;
		height: 100%;
	}
}
</style>
