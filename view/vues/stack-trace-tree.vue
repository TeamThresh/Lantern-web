<template lang="pug">
div.panel-group.accordion#callStackAccordion
</template>

<script>
module.exports = {
	props: [],
	data() {
		return {
			app: this.$root.app,
			data: []
		}
	},
	watch: {
		'app.packageName'() {
		},
		'app.distSelection': {
			handler() {
				this.fetch()
			},
			deep: true
		},
		data: 'draw'
	},
	methods: {
		fetch() {
			let query = this.app.getFilters()
			query.startRange = this.app.distSelection.startRange > 0 ? this.app.distSelection.startRange : query.startRange
			query.endRange = this.app.distSelection.endRange > 0 ? this.app.distSelection.endRange : query.endRange
			query.startUsage = this.app.distSelection.startUsage
			query.endUsage = this.app.distSelection.endUsage
			// query.uuid = this.app.uuid
			// query.startRange = this.app.timestampForUuid
			// query.endRange = parseInt(this.app.timestampForUuid) + 1
			$.ajax({type: 'get', url: `/api/reverseStack/${this.app.packageName}/${this.app.activityName}`, data: query}).then(res => {
				this.clear()
				this.data = []
				res.forEach(d => {
					this.data.push({
						threadName: d.threadName,
						data: this.preprocess(d.stack[0].children)
					})
				})
			})
		},
		clear() {
			$(this.$el).find('*').remove()
		},
		draw() {
			this.data.forEach((d, idx) => {
				$(this.$el).append(`
					<div class='panel panel-default'>
						<div class='panel-heading'>
							<div class='panel-title'>
								<a class='accordion-toggle' href='#thread${idx}' data-toggle='collapse'>${d.threadName}</a>
							</div>
						</div>
						<div class='panel-collapse collapse' id='thread${idx}'>
							<div class='panel-body'>
								<h3>${d.threadName}</h3>
								<div class='jstree jstree-default jstree${idx}'>
								</div>
							</div>
						</div>
					</div>
				`)
				$(this.$el).find(`.jstree${idx}`).jstree({
					core: {
						themes: {
							variant: 'large'
						},
						data: d.data
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
						},
						java: {
							icon: 'fa fa-coffee'
						}
					},
					plugins: ['wholerow', 'types']
				})
			})
		},
		preprocess(arr) {
			arr.forEach(a => {
				a.text = `(${a.count}) ${a.stackName}`
				if( a.stackName.indexOf('android') == 0 ) {
					a.type = 'android'
				} else if( a.stackName.indexOf('java') == 0 ) {
					a.type = 'java'
				}
				if( a.hasOwnProperty('children') ) {
					this.preprocess(a.children)
				}
			})
			return arr
		}
	},
	mounted() {
	}
}
</script>

<style lang="sass">
</style>
