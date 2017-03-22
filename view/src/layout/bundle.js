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
Vue.component('flameGraph', require('../vues/flameGraph.vue'));
Vue.component('bucketGraph', require('../vues/bucketGraph.vue')); 
Vue.component('histogram', require('../vues/histogram.vue'));
Vue.component('screenModeViewer', require('../vues/screenModeViewer.vue'));
Vue.component('topHeader', require('../vues/topHeader.vue'));
Vue.component('leftHeader', require('../vues/leftHeader.vue'));
Vue.component('pageToolbar', require('../vues/pageToolbar.vue'));
Vue.component('rightHeader', require('../vues/rightHeader.vue'));
Vue.component('bottomHeader', require('../vues/bottomHeader.vue'));

/**
 * apply Vue app
 */
window.app = new Vue({el: '#app'});