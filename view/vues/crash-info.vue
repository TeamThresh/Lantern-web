<template lang="pug">
portlet.crash-info(:title='data.crash_name')
	pre
		code {{data.crash_stacktrace}}
	div.device-status
		span wifi : {{data.crash_wifi}}
		br
		span mobile_net : {{data.crash_mobile_net}}
		br
		span gps : {{data.crash_gps}}
</template>

<script>
export default {
	props: [],
	data() {
		return {
			app: this.$root.app,
			data: {}
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
				this.$http.get(`/api/crashDetail/${this.app.packageName}/${this.app.crashId}`).then(res => {
					this.data = res.body
				})
			})
		}
	},
	mounted() {

	}
}
</script>

<style lang="sass">
</style>
