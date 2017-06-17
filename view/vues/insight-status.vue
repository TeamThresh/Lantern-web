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
	div.row
		div.col-xs-12
			h4.title Filter Group
	div.row
		div.col-xs-10
			input.form-control(type='text', placeholder='filter name', v-model='tmpGroupName', maxlength='50')
		div.col-xs-2
			button.btn.btn-success(@click='createGroup') SAVE
		sweet-modal(ref='modal' icon='success') The group added successfully!
		sweet-modal(ref='modal2' icon='error') Failed to add. An error occured!
</template>

<script>
export default {
	data() {
		return {
			app: this.$root.app,
			activityData: [],
			osData: [],
			deviceData: [],
			locationData: [],
			tmpGroupName: ''
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
		},
		createGroup() {
			let name = this.tmpGroupName
			let filters = JSON.parse(JSON.stringify(this.app.filters))
			filters.activity = this.app.insight.status.act.map(d => d.key)
			filters.os = this.app.insight.status.os.map(d => d.key)
			filters.device = this.app.insight.status.dev.map(d => d.key)
			filters.location = this.app.insight.status.loc.map(d => d.key)
			this.app.server.group.save({name}, {filters}).then(res => {
				this.tmpGroupName = ''
				this.$refs.modal.open()
			}, err => {
				this.$refs.modal2.open()
			})
		}
	}
}
</script>

<style lang="scss">
</style>
