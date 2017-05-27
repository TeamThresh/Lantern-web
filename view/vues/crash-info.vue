<template lang="pug">
portlet.crash-info(:title='data.crash_name')
	span(slot='title')
		crash-rank-marker(:crash-rank.sync='data.crash_rank' @mark='mark')
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
				this.$http.get(`/api/crashDetail/${this.app.packageName}/${this.app.crashId}`, {params: this.app.getFilters()}).then(res => {
					this.data = res.body
				})
			})
		},
		mark(crashRank) {
			this.$http.post(`/api/markCrashRank/${this.app.packageName}/${this.app.crashId}`, {crash_rank: crashRank}).then(res => {
				this.data.crash_rank = crashRank
			}, res => {
				console.error(res)
			})
		}
	},
	mounted() {

	}
}
</script>

<style lang="sass">
</style>
