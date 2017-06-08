<template lang="pug">
div.panel-group.accordion#callStackAccordion
</template>

<script>
module.exports = {
	props: ['crashReverseStack', 'watchPackageName', 'stopWatchIsInitDone', 'insight'],
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
			if( this.watchPackageName !== undefined ) {
				this.fetch()
			}
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
		data: 'draw',
		'app.isInitDone'() {
			if( ! this.app.isInitDone ) {
				return
			}
			if( this.stopWatchIsInitDone !== undefined ) {
				return
			}
			this.fetch()
		},
		'app.insight.status'() {
			if( ! this.app.isInitDone ) {
				return
			}
			if( this.insight == undefined ) {
				return
			}
			this.fetch()
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
			let query = this.app.getFilters()
			query.startRange = this.app.distSelection.startRange > 0 ? this.app.distSelection.startRange : query.startRange
			query.endRange = this.app.distSelection.endRange > 0 ? this.app.distSelection.endRange : query.endRange
			query.startUsage = this.app.distSelection.startUsage
			query.endUsage = this.app.distSelection.endUsage
			// uuid
			query.uuid = this.app.uuid.join(',')
			
			if( this.crashReverseStack !== undefined ) {
				$.ajax({type: 'get', url: `/api/crashReverseStack/${this.app.packageName}/${this.app.crashId}`}).then(res => {
					this.data = []
					this.data = res.map(d => {
						return {
							threadName: d.threadName,
							data: this.preprocess(d.stack[0].children)
						}
					})
				})
			} else if( this.insight !== undefined ) {
				let params = {}
				params.activity = this.app.insight.status.act.map(d => d.key).join(',')
				params.os = this.app.insight.status.os.map(d => d.key).join(',')
				params.device = this.app.insight.status.dev.map(d => d.key).join(',')
				params.location = this.app.insight.status.loc.map(d => d.key).join(',')
				this.$http.get(`/api/reverseStack/${this.app.packageName}`, {params}).then(res => {
					this.data = []
					res.body.forEach(d => {
						this.data.push({
							threadName: d.threadName,
							data: this.preprocess(d.stack[0].children)
						})
					})
				})
			} else {
				$.ajax({type: 'get', url: `/api/reverseStack/${this.app.packageName}/${this.app.activityName}`, data: query}).then(res => {
					this.data = []
					res.forEach(d => {
						this.data.push({
							threadName: d.threadName,
							data: this.preprocess(d.stack[0].children)
						})
					})
				})
			}
		},
		clear() {
			$(this.$el).find('*').remove()
		},
		draw() {
			this.clear()
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
				a.id = ''
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
