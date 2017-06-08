<template lang="pug">
div.os-detail-dist-graph
	template(v-for='datum in data')
		h4.title {{datum.title}}
		dist-graph(:init-data='datum.data', stop-watch-is-init-done, stop-watch-package-name, fixed-width='1000', fixed-height='300')
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
		'app.isInitDone'() {
			if( ! this.app.isInitDone ) {
				return
			}
			// this.fetch()
		},
		'app.distSelection': {
			handler() {
				if( ! this.app.isInitDone ) {
					return
				}
				this.fetch()
			},
			deep: true
		},
		'app.uuid'() {
			if( ! this.app.isInitDone ) {
				return
			}
			this.fetch()
		}
	},
	methods: {
		fetch() {
			let params = this.app.getFilters()
			params.startRange = this.app.distSelection.startRange > 0 ? this.app.distSelection.startRange : params.startRange
			params.endRange = this.app.distSelection.endRange > 0 ? this.app.distSelection.endRange : params.endRange
			params.startUsage = this.app.distSelection.startUsage
			params.endUsage = this.app.distSelection.endUsage
			// uuid
			params.uuid = this.app.uuid.join(',')

			switch( this.type ) {
				case 'stat':
					this.$http.get(`/api/detail/${this.app.packageName}/${this.app.activityName}/stat`, {params}).then(res => {
						res.body.forEach(b => {
							b.data.forEach(d => {
								d.date = moment(d.timestamp).valueOf()
							})
						})
						this.data = res.body
					})
					break
				case 'pstat':
					this.$http.get(`/api/detail/${this.app.packageName}/${this.app.activityName}/pstat`, {params}).then(res => {
						res.body.forEach(b => {
							b.data.forEach(d => {
								d.date = moment(d.timestamp).valueOf()
							})
						})
						this.data = res.body
					})
					break
				case 'memory':
					this.$http.get(`/api/detail/${this.app.packageName}/${this.app.activityName}/memory`, {params}).then(res => {
						res.body.forEach(b => {
							b.data.forEach(d => {
								d.date = moment(d.timestamp).valueOf()
							})
						})
						this.data = res.body
					})
					break
				case 'vmstat':
					this.$http.get(`/api/detail/${this.app.packageName}/${this.app.activityName}/vmstat`, {params}).then(res => {
						res.body.forEach(b => {
							b.data.forEach(d => {
								d.date = moment(d.timestamp).valueOf()
							})
						})
						this.data = res.body
					})
					break
			}
		}
	},
	mounted() {

	}
}
</script>

<style lang="scss">
</style>
