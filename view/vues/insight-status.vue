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
		},
		'app.insight.p95'() {
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
				// remove others
				let types = ['act', 'os', 'dev', 'loc']
				types.forEach(type => {
					res.body[type] = res.body[type].filter(d => d.key != 'others')
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
				// save to store
				this.app.insight.status = res.body
			})
		}
	}
}
</script>

<style lang="scss">
</style>
