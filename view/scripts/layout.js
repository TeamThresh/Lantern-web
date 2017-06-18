/**
 * import scripts
 */
// Vue.js
// window.Vue = require('vue/dist/vue.min.js')
window.Vue = require('vue/dist/vue.common.js')
// jQuery
// window.$ = require('jquery')
// window.jQuery = window.$
import VueCookie from 'vue-cookie'
Vue.use(VueCookie)
import VueResource from 'vue-resource'
Vue.use(VueResource)
import VueResize from 'vue-resize'
Vue.use(VueResize)
import showdown from 'showdown'
window.showdown = showdown
import {SweetModal, SweetModalTab} from 'sweet-modal-vue'
Vue.component('sweet-modal', SweetModal)
Vue.component('sweet-modal-tab', SweetModalTab)

/**
 * load Vue Components
 */
// Vue.component('mainmenu', require('../vues/mainmenu.vue'))
// Vue.component('submenu', require('../vues/submenu.vue'))
// Vue.component('filtermenu', require('../vues/filtermenu.vue'))
// Vue.component('flame-graph', require('../vues/flame-graph.vue'))
Vue.component('activity-map', require('../vues/activity-map.vue'))
Vue.component('histogram', require('../vues/histogram.vue'))
// Vue.component('screen-mode-viewer', require('../vues/screen-mode-viewer.vue'))
Vue.component('top-header', require('../vues/top-header.vue'))
Vue.component('left-header', require('../vues/left-header.vue'))
// Vue.component('page-toolbar', require('../vues/page-toolbar.vue'))
// Vue.component('right-header', require('../vues/right-header.vue'))
Vue.component('bottom-header', require('../vues/bottom-header.vue'))
// Vue.component('activity-map-toolbar', require('../vues/activity-map-toolbar.vue'))
Vue.component('portlet', require('../vues/portlet.vue'))
Vue.component('one-depth-user-flow', require('../vues/one-depth-user-flow.vue'))
Vue.component('dist-graph', require('../vues/dist-graph.vue'))
Vue.component('super-table', require('../vues/super-table.vue'))
// Vue.component('radar-chart', require('../vues/radar-chart.vue'))
// Vue.component('device-usage-graph', require('../vues/device-usage-graph.vue'))
Vue.component('line-graph', require('../vues/line-graph.vue'))
Vue.component('worldmap-graph', require('../vues/worldmap-graph.vue'))
Vue.component('card', require('../vues/card.vue'))
// Vue.component('top-crash', require('../vues/top-crash.vue'))
Vue.component('filter-bar', require('../vues/filter-bar.vue'))
Vue.component('app-status', require('../vues/app-status.vue'))
Vue.component('filter-layer', require('../vues/filter-layer.vue'))
Vue.component('filter-group', require('../vues/filter-group.vue'))
Vue.component('user-connection-graph', require('../vues/user-connection-graph.vue'))
Vue.component('stack-trace-tree', require('../vues/stack-trace-tree.vue'))
Vue.component('package-index', require('../vues/package-index.vue'))
Vue.component('filter-status-bar', require('../vues/filter-status-bar.vue'))
Vue.component('area-graph', require('../vues/area-graph.vue'))
Vue.component('pie-graph', require('../vues/pie-graph.vue'))
Vue.component('crash-info', require('../vues/crash-info.vue'))
Vue.component('get-started', require('../vues/get-started.vue'))
Vue.component('crash-rank-marker', require('../vues/crash-rank-marker.vue'))
Vue.component('insight-status', require('../vues/insight-status.vue'))
Vue.component('os-detail-dist-graph', require('../vues/os-detail-dist-graph.vue'))

/**
 * apply Vue app
 */
window.app = new Vue({
	el: '#app',
	data: {
		debug: true,
		serverDead: false,
		app: {
			packages: [],
			packageName: '',
			activityName: '',
			resourceType: '',
			valueType: 'crash',
			filters: {
				location: [],
				device: [],
				os: [],
				activity: [],
				startRange: moment().subtract(7, 'd').hour(0).minute(0).second(0).millisecond(0).valueOf(),
				endRange: moment().valueOf(),
				fixedRange: '7',
				app: '' // app version
			},
			filterGroups: [],
			user: {nickname: '', email: ''},
			distSelection: {
				startUsage: 0,
				endUsage: 100,
				startRange: 0,
				endRange: 0
			},
			uuid: [], // for stack-trace-tree view
			timestampForUuid: 0, // for stack-trace-tree view
			crashId: 0, // for crash detail
			versions: [], // app verseions
			isInitDone: false, // init flag
			insight: {
				type: 'cpu',
				p95: 0,
				status: {},
				selection: {
					startUsage: 0,
					endUsage: 0
				}
			},
			unityVisible: false, // unity support
			getFilters: function() {
				let filters = JSON.parse(JSON.stringify(this.filters))
				let range = this.getRange()
				filters.startRange = range.startRange
				filters.endRange = range.endRange
				filters.location = filters.location.join(',')
				filters.device = filters.device.join(',')
				filters.os = filters.os.join(',')
				filters.activity = filters.activity.join(',')
				return filters
			},
			getRange: function() {
				let range = {
					startRange: this.startRange,
					endRange: this.endRange
				}
				if( this.filters.fixedRange.length > 0 ) {
					range.startRange = moment().subtract(this.filters.fixedRange, 'd').hour(0).minute(0).second(0).millisecond(0).valueOf()
					range.endRange = moment().valueOf()
				}
				return range
			},
			calculateColorValue: function(node) {
				let p = node.crashCount / node.usageCount
				if( p == 0 ) {
					node.crashColorValue = 3
				} else if( p < 0.03 ) {
					node.crashColorValue = 2
				} else {
					node.crashColorValue = 1
				}

				if( node.cpuUsage >= 40 || node.memoryUsage >= 40 ) {
					node.resourceColorValue = 1
				} else if( node.cpuUsage >= 20 || node.memoryUsage >= 20 ) {
					node.resourceColorValue = 2
				} else {
					node.resourceColorValue = 3
				}

				p = node.networkCount / node.usageCount
				if( p == 0 ) {
					node.networkColorValue = 3
				} else if( p < 0.03 ) {
					node.networkColorValue = 2
				} else {
					node.networkColorValue = 1
				}
			},
			drawAxis(svg, xAxis, yAxis, margin) {
				let xAxisGroup = svg.append('g')
					.attr('class', 'x-axis')
					.attr('transform', `translate(0, ${yAxis.scale().range()[0]})`)
					.call(xAxis)
					.selectAll('line').remove()

				let yAxisGroup = svg.append('g')
					.attr('transform', `translate(${margin.left}, 0)`)
					.call(yAxis)
					.selectAll('line').remove()

				let guideGroup = svg.append('g')
				guideGroup.selectAll('line')
					.data(svg.selectAll('g.x-axis text').nodes())
					.enter()
					.append('line')
						.attr('x1', (d) => $(d).position().left - $(d).parent().parent().parent().position().left + 10)
						.attr('x2', (d) => $(d).position().left - $(d).parent().parent().parent().position().left + 10)
						.attr('y1', (d) => $(d).position().top - $(d).parent().parent().parent().position().top - 7)
						.attr('y2', 10)
						.attr('stroke-dasharray', '5, 5')
						.attr('class', 'guide')
				guideGroup.append('line')
					.attr('x1', xAxis.scale().range()[0])
					.attr('x2', xAxis.scale().range()[1])
					.attr('y1', yAxis.scale().range()[0])
					.attr('y2', yAxis.scale().range()[0])
					.attr('stroke', '#3e3e3e')
					.attr('stroke-opacity', 0.5)
				guideGroup.append('line')
					.attr('x1', xAxis.scale().range()[0])
					.attr('x2', xAxis.scale().range()[1])
					.attr('y1', yAxis.scale().range()[0] / 2)
					.attr('y2', yAxis.scale().range()[0] / 2)
					.attr('stroke', '#3e3e3e')
					.attr('stroke-opacity', 0.5)
				guideGroup.append('line')
					.attr('x1', xAxis.scale().range()[0])
					.attr('x2', xAxis.scale().range()[1])
					.attr('y1', yAxis.scale().range()[1])
					.attr('y2', yAxis.scale().range()[1])
					.attr('stroke', '#3e3e3e')
					.attr('stroke-opacity', 0.5)
			},
			server: {
				group: undefined
			},
			trips: {
				index: new Trip([
					{sel: '.mt-element-list', content: `Select a package you want to explore`, position: 'screen-ne', expose: true},
					{sel: `.note.note-info`, content: `Also here you can register new package`, position: 's', expose: true}
				], {showNavigation: true, showCloseBox: true, delay: -1, tripTheme: 'minimalism'}),
				dashboard: new Trip([
					{sel: '.app-status', content: `This shows selected package name<br/>and its versions`, position: 'e', expose: true},
					{sel: `.filter-bar`, content: `These are four layers and options<br/>The app consists of them<br/>Click to filter them`, position: 'e', expose: true},
					{sel: `.filter-group`, content: `You can manage filter group`, position: 'e', expose: true},
					{sel: `.filter-status-bar`, content: `Filtered elements are here`, position: 'e', expose: true},
					{sel: `.map`, content: `Filtered elements are drawn here with their relations`, position: 'w', expose: true},
					{sel: `.user-connection-graph`, content: `Connections and Retentions is here`, position: 'w', expose: true},
					{sel: `.worldmap-graph`, content: `Worldmap Connections places is also here`, position: 'w', expose: true},
					{sel: `.m-grid-col-xs-5 .card`, content: `Crash list here :)`, position: 'w', expose: true},
				], {showNavigation: true, showCloseBox: true, delay: -1, tripTheme: 'minimalism'}),
				activitySummary: new Trip([
					{sel: '.portlet:has(.one-depth-user-flow)', content: `One depth user flow shows<br/>the places where user who had visited this activity have gone`, position: 'e', expose: true},
					{sel: '.row:nth-of-type(2) .portlet:has(.dist-graph)', content: `Distribution Graph<br/>The activity's rendering elapsed time shows here<br/>y axe is millisecond`, position: 'w', expose: true},
					{sel: '.row:nth-of-type(3) .col-md-6:nth-of-type(1) .portlet:has(.dist-graph)', content: `Distribution Graph<br/>The activity's cpu usage shows here<br/>y axe is percentage of usage`, position: 'e', expose: true},
					{sel: '.row:nth-of-type(3) .col-md-6:nth-of-type(2) .portlet:has(.dist-graph)', content: `Distribution Graph<br/>The activity's memory usage shows here<br/>y axe is mega byte of used size`, position: 'w', expose: true},
					{sel: '.row:nth-of-type(4) .col-md-6:nth-of-type(1) .portlet', content: `The activity's whole network outbound calls are here`, position: 'e', expose: true},
					{sel: '.row:nth-of-type(4) .col-md-6:nth-of-type(2) .portlet', content: `The activity's whole crashes are here`, position: 'w', expose: true},
				], {showNavigation: true, showCloseBox: true, delay: -1, tripTheme: 'minimalism'}),
				activityDetail: new Trip([
					{sel: '.col-lg-5.col-sm-12 .portlet', content: `The same distribution graph you saw just before<br/>However it is selectable<br/>just drag and then you know what I mean :)`, position: 'e', expose: true},
					{sel: '.table-scrollable:first', content: `Just after you select any of the above rectagles<br/>every devices that correspond to selected one shows here XD`, position: 'n', expose: true},
					{sel: `.nav.nav-tabs li:nth-of-type(1)`, content: `Reverse Stack<br/>just after you select every call stack collected by agent on each devices<br/>are shown here`, position: 's', expose: true},
					{sel: `.nav.nav-tabs li:nth-of-type(2)`, content: `Specific usage information<br/>from kernel are shown here`, position: 's', expose: true},
					{sel: `.nav.nav-tabs li:nth-of-type(3)`, content: `Specific usage information<br/>from the exact process executing the application<br/>are shown here`, position: 's', expose: true},
					{sel: `.nav.nav-tabs li:nth-of-type(4)`, content: `The exact raw data collected by agent are shown here XD`, position: 's', expose: true},
				], {showNavigation: true, showCloseBox: true, delay: -1, tripTheme: 'minimalism'}),
				insight: new Trip([
					{sel: '.col-lg-5.col-sm-12 .portlet:nth-of-type(1)', content: `Histogram graph<br/>It shows the sum of users at each usage<br/>and there are two vertical lines,<br/>the yellow one stands for fifty percentage of users<br/>and red one does for only five percentage<br/>the behind of red one should the focus :-)`, position: 'e', expose: true},
					{sel: '.col-lg-5.col-sm-12 .portlet:nth-of-type(2)', content: `The users behind of the red line on above graph<br/>The information of them are shown here :o`, position: 'e', expose: true},
					{sel: `.col-lg-7.col-sm-12 .portlet`, content: `And also here is reverse stack for them<br/>you know the guys of which we should take care`, position: 'w', expose: true}
				], {showNavigation: true, showCloseBox: true, delay: -1, tripTheme: 'minimalism'}),
				crashList: new Trip([
					{sel: '.area-graph', content: `Area graph<br/>shows the count of crash on each day`, position: 'e', expose: true},
					{sel: '.pie-graph', content: `Pie graph<br/>shows the each count of crash group<br/>you may set their group at their own detail page`, position: 'w', expose: true},
					{sel: `.table-scrollable`, content: `So here's all the crash your app occured<br/>click whatever you want to see its detail`, position: 'n', expose: true}
				], {showNavigation: true, showCloseBox: true, delay: -1, tripTheme: 'minimalism'}),
				crashDetail: new Trip([
					{sel: '.portlet.light.crash-info.col-xs-12 .caption', content: `Crash name and its group are here`, position: 'screen-ne', expose: true},
					{sel: '.portlet.light.crash-info.col-xs-12 code', content: `The stack trace is here`, position: 's', expose: true},
					{sel: '.device-status', content: `The device status at that time the crash occured`, position: 'n', expose: true},
					{sel: '.row:nth-of-type(3)', content: `The information of all the device the crash occured are here`, position: 's', expose: true},
					{sel: '.row:nth-of-type(4)', content: `Event path<br/>It is like "Referer" in HTTP<br/>The users' movement recored by agent`, position: 'n', expose: true},
					{sel: '.col-md-6:nth-of-type(1) .portlet', content: `Distribution Graph<br/>About Cpu usage while the crash occured`, position: 'n', expose: true},
					{sel: '.col-md-6:nth-of-type(2) .portlet', content: `Distribution Graph<br/>About Memory usage while the crash occured`, position: 'n', expose: true},
				], {showNavigation: true, showCloseBox: true, delay: -1, tripTheme: 'minimalism'}),
				getStarted: new Trip([
					{sel: '.mt-element-list', content: `Select a package you want to explore`, position: 'n', expose: true},
					{sel: `.note.note-info`, content: `Also here you can register new package`, position: 's', expose: true}
				], {showNavigation: true, showCloseBox: true, delay: -1, tripTheme: 'minimalism'})
			}
		}
	},
	watch: {
		'app.filters': {
			handler(v, ov) {
				if( ! this.app.isInitDone ) {
					return
				}
				this.$cookie.set(this.app.packageName, JSON.stringify(this.app.filters))
			},
			deep: true
		}
	},
	methods: {
		redirectToLogin() {
			if( this.serverDead ) {
				return
			}
			this.$cookie.delete('LANTERNSESSIONID')
			alert('로그인이 필요합니다!')
			location.href = '/'
		},
		initServer() {
			this.app.server.group = this.$resource(`/api/group/${this.app.packageName}{/name}`)
		},
		loadCookie() {
			// get filters from cookie
			let cookie = this.$cookie.get(this.app.packageName)
			if( cookie != null ) {
				cookie = JSON.parse(cookie)
				this.app.filters = cookie
				// this.app.filters.location = cookie.location
				// this.app.filters.device = cookie.device
				// this.app.filters.os = cookie.os
				// this.app.filters.activity = cookie.activity
				// this.app.filters.app = cookie.app
				// this.app.filters.fixedRange = cookie.fixedRange
				// this.app.filters.startRange = cookie.startRange
				// this.app.filters.endRange = cookie.endRange
				// supply
				this.app.filters.app = this.app.filters.app || ''
			}
		},
		enableUnity() {
			this.app.unityVisible = true
		},
		isTripped(pathName) {
			let trip = JSON.parse(this.$cookie.get('trip'))
			if( trip == null ) {
				return false
			} else if( trip[pathName] === undefined || trip[pathName] == false ) {
				return false
			} else {
				return true
			}
		},
		setTripped(pathName) {
			let trip = JSON.parse(this.$cookie.get('trip'))
			if( trip == null ) {
				trip = {}
			}
			trip[pathName] = true
			this.$cookie.set('trip', JSON.stringify(trip))
		}
	},
	created() {

	},
	mounted() {
		let p = new Promise((s, f) => {
			// login check
			$.get({url: '/api/packageNames',
				success: (res) => {
					let obj = JSON.parse(window.atobUnicode(this.$cookie.get('LANTERNSESSIONID').split('.')[1]))
					this.app.user.nickname = obj.nickname
					this.app.user.email = obj.username
					s()
				},
				error: (res) => {
					this.redirectToLogin()
					s()
				}
			})
		})
		p = p.then(() => {
			return new Promise((s, f) => {
				let pathNames = location.pathname.split('/')
				switch( pathNames[1] ) {
					case '':
					case 'index':
						$.get({url: '/api/packageNames',
							success: (data) => {
								if( data.length == 0 ) {
									return
								}
								this.app.packages = data
							}
						})
						f()
						break
					case 'activityDetail':
						this.app.resourceType = pathNames[4]
					case 'activitySummary':
					case 'crashDetail':
						this.app.activityName = pathNames[3]
						this.app.crashId = pathNames[3]
					case 'dashboard':
					case 'crashList':
					case 'insight':
						this.app.packageName = pathNames[2]
						this.initServer()
						s()
						break
				}
			})
		})
		// load cookie
		p = p.then(() => {
			return new Promise((s, f) => {
				this.loadCookie()
				s()
			})
		})
		// app verseions
		p = p.then(() => {
			return new Promise((s, f) => {
				this.$http.get(`/api/appVersion/${this.app.packageName}`).then(res => {
					this.app.versions = res.body
					// init version to app.app
					if( this.app.filters.app == '' ) {
						this.app.filters.app = this.app.versions[0]
					}
					s()
				})
			})
		})
		// keyshortcut setting
		p = p.then(() => {
			return new Promise((s, f) => {
				window.addEventListener('keyup', e => {
					if( e.keyCode == 117 || e.keyCode == 12635 || e.keyCode == 85 ) {
						this.enableUnity()
					}
				})
				s()
			})
		})
		// init done
		let handler = () => {
			return new Promise((s, f) => {
				this.app.isInitDone = true
				s()
			})
		}
		p = p.then(handler, handler)
		// trip intro
		p.then(() => {
			let pathName = location.pathname.split('/')[1]
			if( ! this.isTripped(pathName) ) {
				this.app.trips[pathName].start()
				this.setTripped(pathName)
			}
		})
	}
})

window.eunchan = function() {
	let arr = $('.node')
	let id = setInterval(function() {
		if( arr.length > 0 ) {
			let circle = arr.splice(Math.floor(Math.random() * arr.length), 1)
			$(circle).addClass('animated hinge')
		} else {
			clearInterval(id)
		}
	}, 100)
}

window.atobUnicode = function(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
}