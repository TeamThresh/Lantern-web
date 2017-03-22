/**
 * import styles
 */
require('./style.scss');

/**
 * import scripts
 */
// Vue.js
// window.Vue = require('vue/dist/vue.min.js');
window.Vue = require('vue/dist/vue.common.js');
// jQuery
window.$ = require('jquery');
window.jQuery = window.$;

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

/**
 * apply Vue app
 */
window.app = new Vue({el: '#app'});