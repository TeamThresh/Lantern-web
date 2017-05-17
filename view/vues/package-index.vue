<template lang="pug">
.mt-element-list
	.mt-list-head.list-news.ext-1
		.list-head-title-container
			h3.list-title.uppercase select  your app
		.list-count.pull-right.bg-yellow-saffron {{app.packageNames.length}}
	.mt-list-container.list-news.ext-2
		ul
			li.mt-list-item(v-for='package in packages', @click='location.href = `/dashboard/${package.package}`')
				.list-icon-container
					i.fa.fa-angle-right
				.list-thumb
					img(alt='', src='/assets/img/android-logo.png' v-if='package.type == "android"')
					img(alt='', src='/assets/img/unity-logo.png' v-if='package.type == "unity"')
				.list-datetime.bold.uppercase.font-yellow-casablanca {{package.package}}
				.list-item-content
					h3.uppercase.bold {{package.name}}
					p
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
			app: this.$root.app,
			packages: [{
				name: 'dorothy app',
				package: 'com.dorothy.mealiary',
				type: 'android',
				userScore: (Math.random() * 10).toFixed(1),
				activityScore: (Math.random() * 10).toFixed(1),
				crashScore: (Math.random() * 10).toFixed(1),
				resourceScore: (Math.random() * 10).toFixed(1),
				networkScore: (Math.random() * 10).toFixed(1)
			}, {
				name: 'kakaotalk app',
				package: 'com.kakao.kakaotalk',
				type: 'android',
				userScore: (Math.random() * 10).toFixed(1),
				activityScore: (Math.random() * 10).toFixed(1),
				crashScore: (Math.random() * 10).toFixed(1),
				resourceScore: (Math.random() * 10).toFixed(1),
				networkScore: (Math.random() * 10).toFixed(1)
			}, {
				name: 'pokemon go',
				package: 'com.eunchan.pokemongo',
				type: 'unity',
				userScore: (Math.random() * 10).toFixed(1),
				activityScore: (Math.random() * 10).toFixed(1),
				crashScore: (Math.random() * 10).toFixed(1),
				resourceScore: (Math.random() * 10).toFixed(1),
				networkScore: (Math.random() * 10).toFixed(1)
			}]
		}
	},
	watch: {

	},
	methods: {
		click(pack) {
			console.log(pack)
		}
	},
	mounted() {
	}
}
</script>

<style lang="sass">
	.mt-list-item {
		cursor: pointer;
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
</style>
