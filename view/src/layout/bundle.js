/**
 * import styles
 */
require('./style.scss');

/**
 * import scripts
 */
// Vue.js
window.Vue = require('vue/dist/vue.min.js');
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

/**
 * apply Vue app
 */
window.app = new Vue({el: '#app'});