<template lang="pug">
portlet(title='status')
	div.row
		div.col-xs-6
			h4.title Activity
			pie-graph(type='custom', :initData='activityData')
		div.col-xs-6
			h4.title OS
			pie-graph(type='custom', :initData='osData')
		div.col-xs-6
			h4.title Device
			pie-graph(type='custom', :initData='deviceData')
		div.col-xs-6
			h4.title Location
			pie-graph(type='custom', :initData='locationData')
</template>

<script>
export default {
	data() {
		return {
			app: this.$root.app,
			activityData: [],
			osData: [],
			deviceData: [],
			locationData: []
		}
	},
	watch: {
		'app.isInitDone'() {
			if( ! this.app.isInitDone ) {
				return
			}
			this.fetch()
		},
		'app.insight.type'() {
			if( ! this.app.isInitDone ) {
				return
			}
			this.fetch()
		}
	},
	methods: {
		fetch() {
			this.$http.get(`/api/insight/${this.app.packageName}/${this.app.insight.type}/${this.app.insight.p95}`).then(res => {
				this.activityData = res.body.act.map(d => {
					return {label: d.key, value: d.count}
				})
				this.osData = res.body.os.map(d => {
					return {label: d.key, value: d.count}
				})
				this.deviceData = res.body.dev.map(d => {
					return {label: d.key, value: d.count}
				})
				this.locationData = res.body.loc.map(d => {
					return {label: d.key, value: d.count}
				})
			})
		}
	}
}
</script>

<style lang="scss">
</style>
