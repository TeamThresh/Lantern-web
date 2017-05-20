/**
 * import scripts
 */
// Vue.js
// window.Vue = require('vue/dist/vue.min.js');
window.Vue = require('vue/dist/vue.common.js');
// jQuery
// window.$ = require('jquery');
// window.jQuery = window.$;
import VueCookie from 'vue-cookie'
Vue.use(VueCookie)

/**
 * load Vue Components
 */
Vue.component('mainmenu', require('../vues/mainmenu.vue'));
Vue.component('submenu', require('../vues/submenu.vue'));
Vue.component('filtermenu', require('../vues/filtermenu.vue'));
Vue.component('flame-graph', require('../vues/flame-graph.vue'));
Vue.component('activity-map', require('../vues/activity-map.vue'));
Vue.component('histogram', require('../vues/histogram.vue'));
Vue.component('screen-mode-viewer', require('../vues/screen-mode-viewer.vue'));
Vue.component('top-header', require('../vues/top-header.vue'));
Vue.component('left-header', require('../vues/left-header.vue'));
Vue.component('page-toolbar', require('../vues/page-toolbar.vue'));
Vue.component('right-header', require('../vues/right-header.vue'));
Vue.component('bottom-header', require('../vues/bottom-header.vue'));
Vue.component('activity-map-toolbar', require('../vues/activity-map-toolbar.vue'));
Vue.component('portlet', require('../vues/portlet.vue'));
Vue.component('one-depth-user-flow', require('../vues/one-depth-user-flow.vue'));
Vue.component('dist-graph', require('../vues/dist-graph.vue'));
Vue.component('super-table', require('../vues/super-table.vue'));
Vue.component('radar-chart', require('../vues/radar-chart.vue'));
Vue.component('device-usage-graph', require('../vues/device-usage-graph.vue'));
Vue.component('line-graph', require('../vues/line-graph.vue'));
Vue.component('worldmap-graph', require('../vues/worldmap-graph.vue'));
Vue.component('card', require('../vues/card.vue'));
Vue.component('top-crash', require('../vues/top-crash.vue'));
Vue.component('filter-bar', require('../vues/filter-bar.vue'));
Vue.component('app-status', require('../vues/app-status.vue'));
Vue.component('filter-layer', require('../vues/filter-layer.vue'));
Vue.component('filter-group', require('../vues/filter-group.vue'));
Vue.component('user-connection-graph', require('../vues/user-connection-graph.vue'));
Vue.component('stack-trace-tree', require('../vues/stack-trace-tree.vue'));
Vue.component('package-index', require('../vues/package-index.vue'));
Vue.component('filter-status-bar', require('../vues/filter-status-bar.vue'));
Vue.component('area-graph', require('../vues/area-graph.vue'));

/**
 * apply Vue app
 */
window.app = new Vue({
	el: '#app',
	data: {
		debug: true,
		serverDead: true,
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
				android: [],
				startRange: moment().subtract(7, 'd').hour(0).minute(0).second(0).millisecond(0).valueOf(),
				endRange: moment().valueOf(),
				fixedRange: '7'
			},
			filterGroups: [],
			user: {nickname: '', email: ''},
			distSelection: {
				startUsage: 0,
				endUsage: 100,
				startRange: 0,
				endRange: 0
			},
			uuid: '', // for stack-trace-tree view
			timestampForUuid: 0, // for stack-trace-tree view
			getFilters: function() {
				let filters = JSON.parse(JSON.stringify(this.filters))
				let range = this.getRange()
				filters.startRange = range.startRange
				filters.endRange = range.endRange
				filters.location = filters.location.join(',')
				filters.device = filters.device.join(',')
				filters.os = filters.os.join(',')
				filters.android = filters.android.join(',')
				return filters
			},
			getFilterQuery: function() {
				let location = ''
				this.filters.location.forEach((l) => {
					location += l + ','
				})

				let device = ''
				this.filters.device.forEach((d) => {
					device += d + ','
				})

				let os = ''
				this.filters.os.forEach((d) => {
					os += d + ','
				})

				let android = ''
				this.filters.android.forEach((d) => {
					android += d + ','
				})

				let range = this.getRange()

				let query = '?'
				if( location != '' ) {
					query += `&location=${location}`
				}
				if( device != '' ) {
					query += `&device=${device}`
				}
				if( os != '' ) {
					query += `&os=${os}`
				}
				if( android != '' ) {
					query += `&activity=${android}`
				}
				query += `&startRange=${range.startRange}&endRange=${range.endRange}`
				query += '&'

				return query
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

				if( node.cpuCount >= 40 || node.memoryCount >= 40 ) {
					node.resourceColorValue = 1
				} else if( node.cpuCount >= 20 || node.memoryCount >= 20 ) {
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
			}
		}
	},
	watch: {
		'app.filters': {
			handler(v, ov) {
				this.$cookie.set('filters', JSON.stringify(this.app.filters))
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
		}
	},
	created() {
		// get filters from cookie
		if( this.$cookie.get('filters') != null ) {
			this.app.filters = JSON.parse(this.$cookie.get('filters'))
		}
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
									return;
								}
								this.app.packages = data;
							}
						});
						break
					case 'activityDetail':
						this.app.resourceType = pathNames[4]
					case 'activitySummary':
						this.app.activityName = pathNames[3]
					case 'dashboard':
					case 'crashList':
						this.app.packageName = pathNames[2]
						s()
						break
				}
			})
		})
	}
});

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
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}