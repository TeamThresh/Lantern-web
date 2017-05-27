<template lang="pug">
.mt-element-list
	.mt-list-head.list-news.ext-1
		.list-head-title-container
			h3.list-title.uppercase select  your app
		.list-count.pull-right.bg-yellow-saffron {{this.app.packages.length}}
	.mt-list-container.list-news.ext-2
		ul
			li.mt-list-item(v-for='package in this.app.packages', @click='move(package.package, package.app_ver)', :class='{disabled: package.app_ver == null}')
				.list-icon-container(@click.stop='remove(package)')
					i.fa.fa-times.font-red.delete-btn
				.list-thumb(v-if='package.app_ver != null')
					img(alt='', src='/assets/img/android-logo.png' v-if='package.type == "android"')
					img(alt='', src='/assets/img/unity-logo.png' v-if='package.type == "unity"')
				.list-datetime.bold.uppercase.font-yellow-casablanca {{package.package}}
				.list-item-content
					h3.uppercase.bold {{package.name}}
					p
						| version: {{package.app_ver}}
						| &nbsp;&nbsp; mornitoring: &nbsp;
						input.make-switch(type='checkbox', checked, data-on-color='success', data-off-color='default')
					p.hidden
						| User :&nbsp;
						span(:class='{red: package.userScore < 4, yellow: package.userScore < 7, blue: package.userScore < 10}') {{package.userScore}}
						| &nbsp;&nbsp; {{package.type == 'android' ? 'Activitys' : 'Reactivity'}} :&nbsp;
						span(:class='{red: package.activityScore < 4, yellow: package.activityScore < 7, blue: package.activityScore < 10}') {{package.activityScore}}
						| &nbsp;&nbsp; Crash :&nbsp;
						span(:class='{red: package.crashScore < 4, yellow: package.crashScore < 7, blue: package.crashScore < 10}') {{package.crashScore}}
						| &nbsp;&nbsp; Resource :&nbsp;
						span(:class='{red: package.resourceScore < 4, yellow: package.resourceScore < 7, blue: package.resourceScore < 10}') {{package.resourceScore}}
						| &nbsp;&nbsp; Network :&nbsp;
						span(:class='{red: package.networkScore < 4, yellow: package.networkScore < 7, blue: package.networkScore < 10}') {{package.networkScore}}
</template>

<script>
module.exports = {
	props: [],
	data() {
		return {
			app: this.$root.app
		}
	},
	watch: {
		'app.packages'() {
			setTimeout(() => $('.make-switch').bootstrapSwitch(), 500)
		}
	},
	methods: {
		move(packageName, appVersion) {
			if( appVersion == null ) {
				alert("we didn't get any data for this package")
				return
			}
			window.location.href = `/dashboard/${packageName}`
		},
		remove(p) {
			this.$http.delete(`/api/project/${p.package}`).then(res => {
				$.get({url: '/api/packageNames',
					success: (data) => {
						if( data.length == 0 ) {
							return
						}
						this.app.packages = data
					}
				})
			}, res => {
				alert('error occured while seding request to delete it')
			})
		}
	},
	mounted() {
	}
}
</script>

<style lang="sass">
	.mt-list-item {
		cursor: pointer;

		&.disabled {
			cursor: not-allowed;
		}

		.delete-btn {
			cursor: pointer;
		}
	}
	span.blue {
		color: rgb(34, 138, 230);
	}
	span.yellow {
		color: rgb(245, 159, 0);
	}
	span.red {
		color: rgb(217, 72, 15);
	}
.bootstrap-switch-wrapper {
	border: none !important;
}
</style>
